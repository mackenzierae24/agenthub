class ModalHandler {
    constructor() {
        this.modal = document.getElementById('agentModal');
        this.modalContent = document.getElementById('modalContent');
        this.closeBtn = document.querySelector('.close');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.onclick = () => this.close();
        
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        };
    }

    open(agent) {
        this.currentAgent = agent;
        this.renderAgentModal(agent);
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
    }

    renderAgentModal(agent) {
        let inputsHTML = '';
        
        agent.inputs.forEach(input => {
            if (input.type === 'select') {
                inputsHTML += `
                    <div class="input-group">
                        <label>${input.label}</label>
                        <select name="${input.name}">
                            ${input.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (input.type === 'textarea') {
                inputsHTML += `
                    <div class="input-group">
                        <label>${input.label}</label>
                        <textarea name="${input.name}" placeholder="${input.placeholder || ''}"></textarea>
                    </div>
                `;
            } else {
                inputsHTML += `
                    <div class="input-group">
                        <label>${input.label}</label>
                        <input type="${input.type}" name="${input.name}" placeholder="${input.placeholder || ''}" />
                    </div>
                `;
            }
        });

        this.modalContent.innerHTML = `
            <h2>${agent.icon} ${agent.title}</h2>
            <div class="cost-display">
                <strong>Cost: ${agent.price}</strong> - Pay after processing
            </div>
            <form id="agentForm">
                ${inputsHTML}
                <button type="submit" class="process-btn">Process with AI Agent</button>
            </form>
            <div id="resultArea"></div>
        `;

        document.getElementById('agentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processAgent();
        });
    }

    async processAgent() {
        const form = document.getElementById('agentForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const resultArea = document.getElementById('resultArea');
        const processBtn = form.querySelector('.process-btn');
        
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        
        resultArea.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>AI Agent is working on your request...</p>
            </div>
        `;

        try {
            // Call the agent's processor function
            const processorFunction = this.currentAgent.processor[`process${this.currentAgent.id.replace(/-/g, '').replace(/\b\w/g, l => l.toUpperCase())}`];
            const result = await processorFunction(data);
            
            this.renderResults(result);
            
        } catch (error) {
            resultArea.innerHTML = `
                <div class="result-section" style="border-left-color: #dc3545;">
                    <h3>❌ Error</h3>
                    <p>Something went wrong processing your request. Please try again.</p>
                </div>
            `;
        }
        
        processBtn.disabled = false;
        processBtn.textContent = 'Process with AI Agent';
    }

    renderResults(result) {
        const resultArea = document.getElementById('resultArea');
        let resultHTML = '<div class="result-section"><h3>🎯 Results</h3>';
        
        Object.entries(result).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                resultHTML += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong></p><ul>`;
                value.forEach(item => resultHTML += `<li>${item}</li>`);
                resultHTML += '</ul>';
            } else {
                resultHTML += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
            }
        });
        
        resultHTML += `
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; text-align: center;">
                <p><strong>✅ Processing Complete!</strong></p>
                <p>You will be charged ${this.currentAgent.price} for this processing.</p>
                <button onclick="mockPayment()" style="margin-top: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Complete Payment</button>
            </div>
        </div>`;
        
        resultArea.innerHTML = resultHTML;
    }
}

window.ModalHandler = ModalHandler;

function mockPayment() {
    alert('🎉 Payment processed! Thank you for using our AI agent. Results saved to your account.');
    document.getElementById('agentModal').style.display = 'none';
}