class AgentLoader {
    constructor() {
        this.agents = [];
        this.registry = null;
    }

    async loadAgents() {
        try {
            // Load the registry
            const registryResponse = await fetch('agents/registry.json');
            this.registry = await registryResponse.json();

            // Load each agent
            for (const agentInfo of this.registry.agents) {
                if (agentInfo.enabled) {
                    await this.loadAgent(agentInfo);
                }
            }

            console.log('Loaded agents:', this.agents);
            return this.agents;
        } catch (error) {
            console.error('Error loading agents:', error);
            return [];
        }
    }

    async loadAgent(agentInfo) {
        try {
            const configPath = `agents/${agentInfo.path}config.json`;
            const configResponse = await fetch(configPath);
            const config = await configResponse.json();

            // Load the processor
            const processorPath = `agents/${agentInfo.path}processor.js`;
            const processorModule = await import(processorPath);

            const agent = {
                ...config,
                processor: processorModule
            };

            this.agents.push(agent);
        } catch (error) {
            console.error(`Error loading agent ${agentInfo.id}:`, error);
        }
    }

    getAgent(id) {
        return this.agents.find(agent => agent.id === id);
    }
}

window.AgentLoader = AgentLoader;