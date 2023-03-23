module.exports = {
  getProviders: providersConfig => {
    const providers = [];
    const tempProviders = (providersConfig ?? '').split(',');
    for (const provider of tempProviders) {
      const [providerName, providerVersion] = provider.split('@'); // can accept names like phantom@10.25.0
      providers.push({ name: providerName, version: providerVersion });
    }
    return providers;
  },
};
