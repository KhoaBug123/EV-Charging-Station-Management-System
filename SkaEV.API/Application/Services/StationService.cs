using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using SkaEV.API.Infrastructure.Data;
using SkaEV.API.Application.DTOs.Stations;
using Newtonsoft.Json;

namespace SkaEV.API.Application.Services;

public interface IStationService
{
    Task<List<StationDto>> SearchStationsByLocationAsync(SearchStationsRequestDto request);
    Task<StationDto?> GetStationByIdAsync(int stationId);
    Task<List<StationDto>> GetAllStationsAsync(string? city = null, string? status = null);
    Task<StationDto> CreateStationAsync(CreateStationDto dto);
    Task<bool> UpdateStationAsync(int stationId, UpdateStationDto dto);
    Task<bool> DeleteStationAsync(int stationId);
}

public class StationService : IStationService
{
    private readonly SkaEVDbContext _context;

    public StationService(SkaEVDbContext context)
    {
        _context = context;
    }

    public async Task<List<StationDto>> SearchStationsByLocationAsync(SearchStationsRequestDto request)
    {
        // Use stored procedure sp_search_stations_by_location
        var latParam = new SqlParameter("@latitude", request.Latitude);
        var lonParam = new SqlParameter("@longitude", request.Longitude);
        var radiusParam = new SqlParameter("@radius_km", request.RadiusKm);

        var sql = "EXEC sp_search_stations_by_location @latitude, @longitude, @radius_km";

        var stations = await _context.ChargingStations
            .FromSqlRaw(sql, latParam, lonParam, radiusParam)
            .Select(s => new StationDto
            {
                StationId = s.StationId,
                StationName = s.StationName,
                Address = s.Address,
                City = s.City,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                TotalPosts = s.TotalPosts,
                AvailablePosts = s.AvailablePosts,
                OperatingHours = s.OperatingHours,
                Amenities = s.Amenities != null ? JsonConvert.DeserializeObject<List<string>>(s.Amenities) : null,
                StationImageUrl = s.StationImageUrl,
                Status = s.Status
            })
            .ToListAsync();

        return stations;
    }

    public async Task<StationDto?> GetStationByIdAsync(int stationId)
    {
        var station = await _context.ChargingStations
            .Where(s => s.StationId == stationId)
            .Select(s => new StationDto
            {
                StationId = s.StationId,
                StationName = s.StationName,
                Address = s.Address,
                City = s.City,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                TotalPosts = s.TotalPosts,
                AvailablePosts = s.AvailablePosts,
                OperatingHours = s.OperatingHours,
                Amenities = s.Amenities != null ? JsonConvert.DeserializeObject<List<string>>(s.Amenities) : null,
                StationImageUrl = s.StationImageUrl,
                Status = s.Status
            })
            .FirstOrDefaultAsync();

        return station;
    }

    public async Task<List<StationDto>> GetAllStationsAsync(string? city = null, string? status = null)
    {
        var query = _context.ChargingStations.AsQueryable();

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(s => s.City == city);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(s => s.Status == status);
        }

        var stations = await query
            .Select(s => new StationDto
            {
                StationId = s.StationId,
                StationName = s.StationName,
                Address = s.Address,
                City = s.City,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                TotalPosts = s.TotalPosts,
                AvailablePosts = s.AvailablePosts,
                OperatingHours = s.OperatingHours,
                Amenities = s.Amenities != null ? JsonConvert.DeserializeObject<List<string>>(s.Amenities) : null,
                StationImageUrl = s.StationImageUrl,
                Status = s.Status
            })
            .ToListAsync();

        return stations;
    }

    public async Task<StationDto> CreateStationAsync(CreateStationDto dto)
    {
        var station = new Domain.Entities.ChargingStation
        {
            StationName = dto.StationName,
            Address = dto.Address,
            City = dto.City,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            OperatingHours = dto.OperatingHours,
            Amenities = dto.Amenities != null ? JsonConvert.SerializeObject(dto.Amenities) : null,
            StationImageUrl = dto.StationImageUrl,
            Status = "active",
            TotalPosts = 0,
            AvailablePosts = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ChargingStations.Add(station);
        await _context.SaveChangesAsync();

        return new StationDto
        {
            StationId = station.StationId,
            StationName = station.StationName,
            Address = station.Address,
            City = station.City,
            Latitude = station.Latitude,
            Longitude = station.Longitude,
            TotalPosts = station.TotalPosts,
            AvailablePosts = station.AvailablePosts,
            OperatingHours = station.OperatingHours,
            Amenities = dto.Amenities,
            StationImageUrl = station.StationImageUrl,
            Status = station.Status
        };
    }

    public async Task<bool> UpdateStationAsync(int stationId, UpdateStationDto dto)
    {
        var station = await _context.ChargingStations.FindAsync(stationId);
        if (station == null) return false;

        if (!string.IsNullOrEmpty(dto.StationName))
            station.StationName = dto.StationName;

        if (!string.IsNullOrEmpty(dto.Address))
            station.Address = dto.Address;

        if (!string.IsNullOrEmpty(dto.OperatingHours))
            station.OperatingHours = dto.OperatingHours;

        if (dto.Amenities != null)
            station.Amenities = JsonConvert.SerializeObject(dto.Amenities);

        if (!string.IsNullOrEmpty(dto.StationImageUrl))
            station.StationImageUrl = dto.StationImageUrl;

        if (!string.IsNullOrEmpty(dto.Status))
            station.Status = dto.Status;

        station.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteStationAsync(int stationId)
    {
        var station = await _context.ChargingStations.FindAsync(stationId);
        if (station == null) return false;

        _context.ChargingStations.Remove(station);
        await _context.SaveChangesAsync();
        return true;
    }
}
