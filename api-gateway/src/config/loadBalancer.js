class LoadBalancer {
  constructor() {
    this.currentIndexes = new Map();
  }

  // Round Robin Algorithm
  roundRobin(serviceInstances, serviceName) {
    if (!serviceInstances || serviceInstances.length === 0) {
      throw new Error(`No instances available for service: ${serviceName}`);
    }

    let currentIndex = this.currentIndexes.get(serviceName) || 0;
    const selectedInstance = serviceInstances[currentIndex];

    // Update index for next request
    this.currentIndexes.set(
      serviceName,
      (currentIndex + 1) % serviceInstances.length
    );

    return selectedInstance;
  }

  // Health check for instances
  async healthCheck(instance) {
    try {
      const response = await fetch(`${instance}/health`, {
        method: "GET",
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${instance}:`, error.message);
      return false;
    }
  }

  // Get healthy instances only
  async getHealthyInstances(instances) {
    const healthChecks = await Promise.allSettled(
      instances.map((instance) => healthCheck(instance))
    );

    console.log("instances" + instances);
    console.log("healthChecks" + healthChecks);

    return instances.filter(
      (instance, index) =>
        healthChecks[index].status === "fulfilled" && healthChecks[index].value
    );
  }

  // Main method to get next instance
  async getNextInstance(serviceConfig) {
    const { instances, service } = serviceConfig;

    // Si solo hay una instancia, devolverla directamente
    if (instances.length === 1) {
      return instances[0];
    }

    // Obtener instancias saludables
    const healthyInstances = await getHealthyInstances(instances);

    if (healthyInstances.length === 0) {
      console.warn(
        `No healthy instances for service ${service}, using all instances`
      );
      return roundRobin(instances, service);
    }

    return roundRobin(healthyInstances, service);
  }
}

export const loadBalancer = new LoadBalancer();
