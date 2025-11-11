using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SkaEV.API.Application.DTOs.Issues;
using SkaEV.API.Infrastructure.Data;

namespace SkaEV.API.Application.Services;

public class IssueService : IIssueService
{
    private readonly SkaEVDbContext _context;
    private readonly ILogger<IssueService> _logger;

    public IssueService(SkaEVDbContext context, ILogger<IssueService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<IssueDto>> GetIssuesAsync(string? status, string? priority, int? stationId, int? assignedToUserId, int page, int pageSize)
    {
        // Note: This requires the Issues table from 08_ADD_ISSUES_TABLE.sql
        // Returning empty list if table doesn't exist
        try
        {
            // Would implement once Issues table is created
            return new List<IssueDto>();
        }
        catch
        {
            return new List<IssueDto>();
        }
    }

    public async Task<int> GetIssueCountAsync(string? status, string? priority, int? stationId, int? assignedToUserId)
    {
        return 0; // Placeholder
    }

    public async Task<IEnumerable<IssueDto>> GetUserAssignedIssuesAsync(int userId, string? status)
    {
        return new List<IssueDto>(); // Placeholder
    }

    public async Task<IssueDetailDto?> GetIssueDetailAsync(int issueId)
    {
        return null; // Placeholder
    }

    public async Task<IssueDto> CreateIssueAsync(int reportedByUserId, CreateIssueDto createDto)
    {
        try
        {
            // Verify station exists
            var station = await _context.ChargingStations.FindAsync(createDto.StationId);
            if (station == null)
            {
                throw new ArgumentException($"Station with ID {createDto.StationId} not found");
            }

            // Get reporter user info
            var reporter = await _context.Users.FindAsync(reportedByUserId);
            
            // Create issue entity
            var issue = new Domain.Entities.Issue
            {
                StationId = createDto.StationId,
                Title = createDto.Title,
                Description = createDto.Description,
                Category = "general", // Default category, can be enhanced later
                Status = "reported",
                Priority = createDto.Priority,
                ReportedByUserId = reportedByUserId,
                ReportedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Issues.Add(issue);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Issue {IssueId} created by user {UserId}", issue.IssueId, reportedByUserId);

            // Return DTO
            return new IssueDto
            {
                IssueId = issue.IssueId,
                StationId = issue.StationId,
                StationName = station.StationName,
                PostId = null,
                PostName = null,
                Title = issue.Title,
                Description = issue.Description,
                Status = issue.Status,
                Priority = issue.Priority,
                ReportedByUserId = issue.ReportedByUserId,
                ReportedByUserName = reporter?.FullName ?? "Unknown",
                AssignedToUserId = issue.AssignedToUserId,
                AssignedToUserName = null,
                CreatedAt = issue.CreatedAt,
                UpdatedAt = issue.UpdatedAt,
                ResolvedAt = issue.ResolvedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating issue");
            throw;
        }
    }

    public async Task<IssueDto> UpdateIssueAsync(int issueId, UpdateIssueDto updateDto)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task<IssueDto> AssignIssueAsync(int issueId, int assignedToUserId)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task<IssueDto> UpdateIssueStatusAsync(int issueId, string status, string? resolution)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task<IssueCommentDto> AddCommentAsync(int issueId, int userId, string comment)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task<IssueAttachmentDto> AddAttachmentAsync(int issueId, int userId, IFormFile file, string? description)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task DeleteIssueAsync(int issueId)
    {
        throw new NotImplementedException("Issues table not yet created. Run 08_ADD_ISSUES_TABLE.sql first.");
    }

    public async Task<IssueStatisticsDto> GetIssueStatisticsAsync(int? stationId)
    {
        return new IssueStatisticsDto
        {
            TotalIssues = 0,
            OpenIssues = 0,
            InProgressIssues = 0,
            ResolvedIssues = 0,
            ClosedIssues = 0,
            HighPriorityIssues = 0,
            MediumPriorityIssues = 0,
            LowPriorityIssues = 0,
            AverageResolutionTimeHours = 0
        };
    }

    public async Task<IEnumerable<MaintenanceScheduleDto>> GetMaintenanceScheduleAsync(int? stationId, DateTime? startDate, DateTime? endDate)
    {
        return new List<MaintenanceScheduleDto>(); // Placeholder
    }
}
