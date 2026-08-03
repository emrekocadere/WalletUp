using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;

namespace CashCat.Infstructre.Services;

public class RedisCacheService(IDistributedCache cache, ILogger<RedisCacheService> logger) : ICacheService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var cachedValue = await cache.GetStringAsync(key);
            if (string.IsNullOrWhiteSpace(cachedValue))
            {
                logger.LogDebug("Cache miss for key: {Key}", key);
                return default;
            }

            var deserialized = JsonSerializer.Deserialize<T>(cachedValue, SerializerOptions);
            logger.LogInformation("Cache hit for key: {Key}", key);
            return deserialized;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving from Redis cache for key: {Key}", key);
            return default; // Graceful fallback - return null instead of throwing
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan ttl)
    {
        try
        {
            var serializedValue = JsonSerializer.Serialize(value, SerializerOptions);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl
            };

            await cache.SetStringAsync(key, serializedValue, options);
            logger.LogInformation("Successfully cached key: {Key} with TTL: {TTL}ms", key, ttl.TotalMilliseconds);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting cache for key: {Key}. Redis connection may be down.", key);
        }
    }
}