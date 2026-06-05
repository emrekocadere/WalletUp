using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;

namespace CashCat.Infstructre.Services;

public class RedisCacheService(
    IDistributedCache cache,
    ILogger<RedisCacheService> logger) : ICacheService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task<T?> GetAsync<T>(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return default;
        }

        try
        {
            var cachedValue = await cache.GetStringAsync(key);
            if (string.IsNullOrWhiteSpace(cachedValue))
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(cachedValue, SerializerOptions);
        }
        catch (JsonException ex)
        {
            logger.LogWarning(ex, "Failed to deserialize cached value for key {CacheKey}.", key);
            return default;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to read cache value for key {CacheKey}.", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan ttl)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return;
        }

        try
        {
            var serializedValue = JsonSerializer.Serialize(value, SerializerOptions);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl
            };

            await cache.SetStringAsync(key, serializedValue, options);
        }
        catch (JsonException ex)
        {
            logger.LogWarning(ex, "Failed to serialize cache value for key {CacheKey}.", key);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to write cache value for key {CacheKey}.", key);
        }
    }
}
