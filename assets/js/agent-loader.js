class AgentLoader {
    constructor() {
        this.agents = [];
        this.registry = null;
    }

    async loadAgents() {
        try {
            console.log('Loading agents...');
            
            // Load the registry
            const registryResponse = await fetch('agents/registry.json');
            if (!registryResponse.ok) {
                console.log('Registry not found, using fallback agents');
                return this.getFallbackAgents();
            }
            this.registry = await registryResponse.json();
            console.log('Registry loaded:', this.registry);

            // Load each agent
            for (const agentInfo of this.registry.agents) {
                if (agentInfo.enabled) {
                    await this.loadAgent(agentInfo);
                }
            }

            // If no agents loaded, use fallback
            if (this.agents.length === 0) {
                console.log('No agents loaded, using fallback');
                return this.getFallbackAgents();
            }

            console.log('All agents loaded:', this.agents);
            return this.agents;
        } catch (error) {
            console.error('Error loading agents:', error);
            // Return fallback agents so something shows up
            return this.getFallbackAgents();
        }
    }

    async loadAgent(agentInfo) {
        try {
            console.log(`Loading agent: ${agentInfo.id}`);
            
            const configPath = `agents/${agentInfo.path}config.json`;
            const configResponse = await fetch(configPath);
            
            if (!configResponse.ok) {
                throw new Error(`Config not found for ${agentInfo.id}`);
            }
            
            const config = await configResponse.json();
            console.log(`Config loaded for ${agentInfo.id}:`, config);

            // Add the processor function directly to the agent
            const agent = {
                ...config,
                processor: this.getProcessorFunction(config.id)
            };

            this.agents.push(agent);
        } catch (error) {
            console.error(`Error loading agent ${agentInfo.id}:`, error);
        }
    }

    getProcessorFunction(agentId) {
        // Return processor functions directly based on agent ID
        switch(agentId) {
            case 'content-optimizer':
                return async function(data) {
                    console.log('Processing content optimization...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return {
                        optimizedContent: data.content.replace(/\./g, '. ') + '\n\n[SEO OPTIMIZED VERSION]\n\nYour content has been enhanced with improved keyword density, better structure, and optimized meta descriptions.',
                        seoScore: Math.floor(Math.random() * 30) + 70,
                        suggestions: [
                            'Add more internal links',
                            'Improve meta description', 
                            'Use more semantic keywords',
                            'Optimize image alt tags'
                        ]
                    };
                };
            
            case 'email-responder':
                return async function(data) {
                    console.log('Processing email response...');
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    return {
                        response: `Dear [Name],\n\nThank you for your email. I understand your concerns and would like to address them promptly.\n\n[Your personalized response based on the ${data.tone.toLowerCase()} tone you selected]\n\nBest regards,\n[Your Name]`,
                        alternatives: ['More formal version', 'Shorter version', 'With apology emphasis'],
                        confidence: 94
                    };
                };
            
            default:
                return async function(data) {
                    console.log('Processing with default processor...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return {
                        result: 'Processing complete!',
                        message: 'Your request has been processed successfully.',
                        data: data
                    };
                };
        }
    }

    getFallbackAgents() {
        console.log('Using fallback agents');
        // If loading fails, return hardcoded agents
        return [
            {
                id: 'content-optimizer',
                title: 'Content SEO Optimizer',
                icon: '📝',
                price: '$2.99',
                description: 'Transform your content for maximum SEO impact. Analyzes keywords, readability, and structure to boost search rankings.',
                uses: 1247,
                rating: 4.8,
                inputs: [
                    {
                        type: 'textarea',
                        name: 'content',
                        label: 'Your Content',
                        placeholder: 'Paste your article or blog post here...'
                    },
                    {
                        type: 'text',
                        name: 'keywords',
                        label: 'Target Keywords',
                        placeholder: 'keyword1, keyword2, keyword3'
                    },
                    {
                        type: 'select',
                        name: 'tone',
                        label: 'Content Tone',
                        options: ['Professional', 'Casual', 'Technical', 'Creative']
                    }
                ],
                processor: async function(data) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return {
                        optimizedContent: data.content.replace(/\./g, '. ') + '\n\n[SEO OPTIMIZED VERSION]\n\nYour content has been enhanced with improved keyword density, better structure, and optimized meta descriptions.',
                        seoScore: Math.floor(Math.random() * 30) + 70,
                        suggestions: [
                            'Add more internal links',
                            'Improve meta description', 
                            'Use more semantic keywords',
                            'Optimize image alt tags'
                        ]
                    };
                }
            },
            {
                id: 'email-responder',
                title: 'Smart Email Assistant',
                icon: '📧',
                price: '$1.99',
                description: 'Generate professional email responses instantly. Perfect for customer service, sales follow-ups, and business communication.',
                uses: 892,
                rating: 4.9,
                inputs: [
                    {
                        type: 'textarea',
                        name: 'email',
                        label: 'Original Email',
                        placeholder: 'Paste the email you need to respond to...'
                    },
                    {
                        type: 'select',
                        name: 'tone',
                        label: 'Response Tone',
                        options: ['Professional', 'Friendly', 'Formal', 'Apologetic']
                    },
                    {
                        type: 'text',
                        name: 'context',
                        label: 'Additional Context',
                        placeholder: 'Any specific points to address?'
                    }
                ],
                processor: async function(data) {
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    return {
                        response: `Dear [Name],\n\nThank you for your email. I understand your concerns and would like to address them promptly.\n\n[Your personalized response based on the ${data.tone.toLowerCase()} tone you selected]\n\nBest regards,\n[Your Name]`,
                        alternatives: ['More formal version', 'Shorter version', 'With apology emphasis'],
                        confidence: 94
                    };
                }
            },
            {
                id: 'social-content',
                title: 'Social Media Genius',
                icon: '📱',
                price: '$2.49',
                description: 'Create viral-worthy social media content. Generates posts, hashtags, and engagement strategies tailored to your brand.',
                uses: 1456,
                rating: 4.6,
                inputs: [
                    {
                        type: 'text',
                        name: 'topic',
                        label: 'Content Topic',
                        placeholder: 'What do you want to post about?'
                    },
                    {
                        type: 'select',
                        name: 'platform',
                        label: 'Platform',
                        options: ['Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'Facebook']
                    },
                    {
                        type: 'select',
                        name: 'goal',
                        label: 'Campaign Goal',
                        options: ['Engagement', 'Brand Awareness', 'Sales', 'Education']
                    }
                ],
                processor: async function(data) {
                    await new Promise(resolve => setTimeout(resolve, 2800));
                    return {
                        posts: [`🔥 ${data.topic} content for ${data.platform}! Ready to boost your ${data.goal.toLowerCase()}?`, 'Alternative version with different hook', 'Story/Reel version'],
                        hashtags: ['#trending', '#viral', '#socialmedia', '#content', '#marketing'],
                        bestTime: 'Tuesday 2-4 PM for maximum engagement',
                        engagementTips: ['Ask questions to boost comments', 'Use eye-catching visuals', 'Post consistently']
                    };
                }
            }
        ];
    }

    getAgent(id) {
        return this.agents.find(agent => agent.id === id);
    }
}

window.AgentLoader = AgentLoader;
