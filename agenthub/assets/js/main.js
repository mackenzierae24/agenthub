class AgentHub {
    constructor() {
        this.agentLoader = new AgentLoader();
        this.modalHandler = new ModalHandler();
        this.agents = [];
    }

    async init() {
        await this.loadAgents();
        this.renderAgents();
    }

    async loadAgents() {
        this.agents = await this.agentLoader.loadAgents();
    }

    renderAgents() {
        const grid = document.getElementById('agentGrid');
        grid.innerHTML = '';

        this.agents.forEach(agent => {
            const card = document.createElement('div');
            card.className = 'agent-card';
            card.onclick = () => this.modalHandler.open(agent);
            
            card.innerHTML = `
                <div class="agent-header">
                    <div class="agent-icon">${agent.icon}</div>
                    <div>
                        <div class="agent-title">${agent.title}</div>
                        <div class="agent-price">${agent.price}</div>
                    </div>
                </div>
                <div class="agent-description">${agent.description}</div>
                <div class="agent-stats">
                    <span>🔥 ${agent.uses} uses</span>
                    <span>⭐ ${agent.rating}/5</span>
                </div>
                <button class="use-agent-btn">Use Agent →</button>
            `;
            
            grid.appendChild(card);
        });
    }
}

// Admin functions
function showAgentCreator() {
    alert('Agent Creator coming soon! This will allow you to create custom AI agents for specific tasks.');
}

function showAnalytics() {
    alert('Analytics Dashboard:\n\n• Total Revenue: $12,847\n• Most Popular Agent: Content SEO Optimizer\n• Active Users: 1,247\n• Avg. Revenue per User: $8.32');
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new AgentHub();
    app.init();
});