using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;

namespace CashCat.Infstructre.Services;

public class RedisCacheService(IDistributedCache cache) : ICacheService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var cachedValue = await cache.GetStringAsync(key);
            if (string.IsNullOrWhiteSpace(cachedValue))
            {
                return default;
            }

            var deserialized = JsonSerializer.Deserialize<T>(cachedValue, SerializerOptions);
            return deserialized;
        }
        catch (Exception ex)
        {
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
        }
        catch (Exception ex)
        {
        }
    }
}