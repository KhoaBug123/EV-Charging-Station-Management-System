namespace SkaEV.API.Domain.Entities;

public class PricingRule
{
    public int RuleId { get; set; }
    public int? StationId { get; set; }
    public string? VehicleType { get; set; } // motorcycle, car, null
    public TimeSpan? TimeRangeStart { get; set; }
    public TimeSpan? TimeRangeEnd { get; set; }
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ChargingStation? ChargingStation { get; set; }
}
