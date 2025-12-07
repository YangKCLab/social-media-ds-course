// Snowball Sampling Interactive Demo
class SnowballSamplingDemo {
    constructor() {
        this.currentRound = 0;
        this.seedKeywords = new Set(['climate change', 'global warming']);
        this.discoveredKeywords = new Map();
        this.keywordDatabase = {};
        this.connections = [];
        this.isPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlaySpeed = 1000; // Default 2 seconds
        this.simulation = null;
        this.svg = null;
        this.nodes = [];
        this.links = [];
        this.nodesPositioned = false;
        this.progressData = []; // Track discovery progress over rounds
        this.totalProgressSvg = null;
        this.newProgressSvg = null;

        this.init();
    }

    async init() {
        await this.loadKeywordData();
        this.setupEventListeners();
        this.updateDisplay();
        this.showStep(0);

        // Delay visualization initialization to ensure DOM is fully rendered
        setTimeout(() => {
            this.initializeVisualization();
            this.initializeProgressPlots();
        }, 100);
    }

    async loadKeywordData() {
        try {
            const response = await fetch('./data/sample-keywords.json');
            const data = await response.json();
            this.keywordDatabase = data.keywordDatabase;
            this.connections = data.connections;
            this.allAvailableKeywords = new Set(Object.keys(this.keywordDatabase));

            // Initialize all keywords as nodes but mark discovery status
            Object.keys(this.keywordDatabase).forEach(keyword => {
                const isDiscovered = this.seedKeywords.has(keyword);
                this.discoveredKeywords.set(keyword, {
                    round: isDiscovered ? 0 : -1, // -1 means not yet discovered
                    type: isDiscovered ? 'seed' : 'undiscovered',
                    related: this.keywordDatabase[keyword]?.related || [],
                    examples: this.keywordDatabase[keyword]?.examples || [],
                    frequency: this.keywordDatabase[keyword]?.frequency || 0,
                    discovered: isDiscovered
                });
            });

            console.log(`Initialized ${Object.keys(this.keywordDatabase).length} keywords (${this.seedKeywords.size} seeds)`);
        } catch (error) {
            console.error('Error loading keyword data:', error);
            // Fallback to basic data
            this.initializeFallbackData();
        }
    }

    initializeFallbackData() {
        this.keywordDatabase = {
            'climate change': {
                related: ['global warming', 'carbon emissions', 'greenhouse gases'],
                examples: ['Scientists warn about climate change effects'],
                frequency: 0.95
            },
            'global warming': {
                related: ['climate change', 'temperature rise', 'ice caps melting'],
                examples: ['Global warming causes heat waves'],
                frequency: 0.87
            }
        };
    }

    setupEventListeners() {
        // Seed management
        document.getElementById('addSeed').addEventListener('click', () => this.addSeed());
        document.getElementById('seedInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSeed();
        });

        // Control buttons
        document.getElementById('startSampling').addEventListener('click', () => this.startSampling());
        document.getElementById('nextRound').addEventListener('click', () => this.nextRound());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('autoPlay').addEventListener('click', () => this.toggleAutoPlay());

        // Speed control
        document.getElementById('speedSlider').addEventListener('input', (e) => this.updateAutoPlaySpeed(e.target.value));

        // Export buttons
        document.getElementById('exportJson').addEventListener('click', () => this.exportAsJson());
        document.getElementById('exportCsv').addEventListener('click', () => this.exportAsCsv());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('keywordModal')) {
                this.closeModal();
            }
        });

        // Remove seed buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-seed')) {
                this.removeSeed(e.target.dataset.keyword);
            }
        });
    }

    addSeed() {
        const input = document.getElementById('seedInput');
        const keyword = input.value.trim().toLowerCase();

        if (keyword && !this.seedKeywords.has(keyword)) {
            this.seedKeywords.add(keyword);

            // Update existing keyword or create new one
            const existingKeyword = this.discoveredKeywords.get(keyword);
            if (existingKeyword) {
                existingKeyword.round = 0;
                existingKeyword.type = 'seed';
                existingKeyword.discovered = true;
            } else {
                this.discoveredKeywords.set(keyword, {
                    round: 0,
                    type: 'seed',
                    related: this.keywordDatabase[keyword]?.related || [],
                    examples: this.keywordDatabase[keyword]?.examples || [`Example usage of "${keyword}"`],
                    frequency: this.keywordDatabase[keyword]?.frequency || 0.5,
                    discovered: true
                });
            }

            input.value = '';
            this.nodesPositioned = false; // Reset positions when seeds change
            this.updateSeedDisplay();
            this.updateMetrics();
            this.updateVisualization();
        }
    }

    removeSeed(keyword) {
        if (this.currentRound === 0) {
            this.seedKeywords.delete(keyword);

            // Mark as undiscovered instead of deleting
            const existingKeyword = this.discoveredKeywords.get(keyword);
            if (existingKeyword) {
                existingKeyword.round = -1;
                existingKeyword.type = 'undiscovered';
                existingKeyword.discovered = false;
            }

            this.nodesPositioned = false; // Reset positions when seeds change
            this.updateSeedDisplay();
            this.updateMetrics();
            this.updateVisualization();
        }
    }

    updateSeedDisplay() {
        const seedList = document.getElementById('seedList');
        seedList.innerHTML = '';

        this.seedKeywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'seed-tag';
            tag.innerHTML = `${keyword} <button class="remove-seed" data-keyword="${keyword}">×</button>`;
            seedList.appendChild(tag);
        });
    }

    startSampling() {
        if (this.seedKeywords.size === 0) {
            alert('Please add at least one seed keyword before starting.');
            return;
        }

        document.getElementById('startSampling').disabled = true;
        document.getElementById('nextRound').disabled = false;
        document.getElementById('autoPlay').disabled = false;

        this.showStep(1);
        this.nextRound();
    }

    nextRound() {
        this.currentRound++;
        const newKeywords = this.discoverKeywords();

        if (newKeywords.length === 0) {
            console.log(`Round ${this.currentRound}: No new keywords found - sampling complete`);
            document.getElementById('roundStatus').textContent = 'Sampling complete - no new keywords found';
            document.getElementById('nextRound').disabled = true;
            document.getElementById('autoPlay').disabled = true;
            this.showStep(3);
            return;
        }

        // Mark keywords as discovered and update their status
        newKeywords.forEach(keyword => {
            const existingKeyword = this.discoveredKeywords.get(keyword);
            if (existingKeyword && !existingKeyword.discovered) {
                existingKeyword.round = this.currentRound;
                existingKeyword.type = 'discovered';
                existingKeyword.discovered = true;
            }
        });

        this.updateDisplay();
        this.updateVisualization();
        this.updateProgressPlots();
        this.showStep(Math.min(this.currentRound + 1, 3));

        // Auto-continue if needed
        if (this.isPlaying) {
            setTimeout(() => this.nextRound(), this.autoPlaySpeed);
        }
    }

    discoverKeywords() {
        const discoveredKeywords = Array.from(this.discoveredKeywords.entries())
            .filter(([keyword, data]) => data.discovered)
            .map(([keyword, data]) => keyword);

        console.log(`Round ${this.currentRound}: Starting with ${discoveredKeywords.length} discovered keywords`);

        const newKeywords = [];

        // For each discovered keyword, find related keywords that haven't been discovered yet
        discoveredKeywords.forEach(keyword => {
            const keywordData = this.keywordDatabase[keyword];

            if (keywordData && keywordData.related) {
                keywordData.related.forEach(relatedKeyword => {
                    const relatedData = this.discoveredKeywords.get(relatedKeyword);
                    if (relatedData && !relatedData.discovered && !newKeywords.includes(relatedKeyword)) {
                        // Simulate discovery probability based on frequency
                        const discoveryChance = (keywordData.frequency || 0.5) * 0.7;
                        if (Math.random() < discoveryChance) {
                            newKeywords.push(relatedKeyword);
                        }
                    }
                });
            }
        });

        console.log(`Round ${this.currentRound}: Found ${newKeywords.length} new keywords:`, newKeywords);

        // Return all discovered keywords without limit
        return newKeywords;
    }

    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        const button = document.getElementById('autoPlay');

        if (this.isPlaying) {
            button.textContent = 'Pause';
            button.style.background = '#f56565';
            this.nextRound();
        } else {
            button.textContent = 'Auto Play';
            button.style.background = '';
        }
    }

    updateAutoPlaySpeed(value) {
        this.autoPlaySpeed = parseFloat(value) * 1000; // Convert seconds to milliseconds
        document.getElementById('speedValue').textContent = `${value}s`;
    }

    reset() {
        this.currentRound = 0;
        this.isPlaying = false;
        this.progressData = []; // Reset progress data

        // Reset all keywords to undiscovered except seeds
        this.discoveredKeywords.forEach((data, keyword) => {
            if (this.seedKeywords.has(keyword)) {
                data.round = 0;
                data.type = 'seed';
                data.discovered = true;
            } else {
                data.round = -1;
                data.type = 'undiscovered';
                data.discovered = false;
            }
        });

        // Reset UI
        document.getElementById('startSampling').disabled = false;
        document.getElementById('nextRound').disabled = true;
        document.getElementById('autoPlay').disabled = true;
        document.getElementById('autoPlay').textContent = 'Auto Play';
        document.getElementById('autoPlay').style.background = '';

        this.updateDisplay();
        this.updateVisualization();
        this.updateProgressPlots();
        this.showStep(0);
    }

    updateDisplay() {
        const discoveredCount = Array.from(this.discoveredKeywords.values())
            .filter(kw => kw.discovered).length;

        document.getElementById('currentRound').textContent = this.currentRound;
        document.getElementById('totalKeywords').textContent = discoveredCount;

        const newThisRound = Array.from(this.discoveredKeywords.values())
            .filter(kw => kw.round === this.currentRound).length;
        document.getElementById('newKeywords').textContent = newThisRound;

        const previousTotal = discoveredCount - newThisRound;
        const growthRate = this.currentRound > 0 && previousTotal > 0 ?
            ((newThisRound / previousTotal) * 100).toFixed(1) : 0;
        document.getElementById('growthRate').textContent = `${growthRate}%`;

        document.getElementById('roundStatus').textContent =
            `Round ${this.currentRound} - Found ${newThisRound} new keywords`;

        this.updateMetrics();
    }

    updateMetrics() {
        const discoveredCount = Array.from(this.discoveredKeywords.values())
            .filter(kw => kw.discovered).length;
        document.getElementById('totalKeywords').textContent = discoveredCount;
    }

    showStep(stepNumber) {
        // Hide all steps
        for (let i = 0; i <= 3; i++) {
            const step = document.getElementById(`step-${i}`);
            if (step) step.style.display = 'none';
        }

        // Show current step
        const currentStep = document.getElementById(`step-${stepNumber}`);
        if (currentStep) currentStep.style.display = 'block';
    }

    // Network Visualization Methods
    initializeVisualization() {
        const container = document.querySelector('.network-container');
        const rect = container.getBoundingClientRect();

        this.svg = document.getElementById('networkSvg');

        // Ensure minimum dimensions and handle cases where container isn't properly sized yet
        const svgWidth = Math.max(rect.width, 800);
        const svgHeight = 600;

        this.svg.setAttribute('width', svgWidth);
        this.svg.setAttribute('height', svgHeight);

        this.svgWidth = svgWidth;
        this.svgHeight = svgHeight;


        // Create groups for links and nodes
        this.linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.linkGroup.setAttribute('class', 'links');
        this.svg.appendChild(this.linkGroup);

        this.nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.nodeGroup.setAttribute('class', 'nodes');
        this.svg.appendChild(this.nodeGroup);

        // Initial draw of all nodes
        this.prepareNetworkData();
        this.layoutNodes();
        this.drawNodes();
        this.updateVisualization();
    }

    updateVisualization() {
        if (!this.svg) return;

        // Prepare data
        this.prepareNetworkData();

        // Position nodes in a simple layout
        this.layoutNodes();

        // Update links (clear and redraw since connections change)
        this.linkGroup.innerHTML = '';
        this.drawLinks();

        // Update existing nodes (don't recreate, just update their appearance)
        this.updateNodes();
    }

    layoutNodes() {
        // Only calculate positions if nodes don't already have fixed positions
        if (this.nodesPositioned) return;

        const centerX = this.svgWidth / 2;
        const centerY = this.svgHeight / 2;
        const maxRadius = Math.min(this.svgWidth, this.svgHeight) / 2.2;

        // Get all nodes and assign them to fixed rings
        const allNodes = [...this.nodes];

        // Separate seed nodes first
        const seedNodes = allNodes.filter(n => this.seedKeywords.has(n.id));
        const nonSeedNodes = allNodes.filter(n => !this.seedKeywords.has(n.id));

        // Position seed nodes in the center
        seedNodes.forEach((node, index) => {
            const angle = (index * 2 * Math.PI) / seedNodes.length;
            node.x = centerX + Math.cos(angle) * 50;
            node.y = centerY + Math.sin(angle) * 50;
        });

        // Distribute all non-seed nodes across concentric rings
        const ringsCount = 4;
        const nodesPerRing = Math.ceil(nonSeedNodes.length / ringsCount);

        nonSeedNodes.forEach((node, index) => {
            const ringIndex = Math.floor(index / nodesPerRing);
            const positionInRing = index % nodesPerRing;
            const totalInThisRing = Math.min(nodesPerRing, nonSeedNodes.length - ringIndex * nodesPerRing);

            const ringRadius = maxRadius * (0.4 + (ringIndex + 1) * 0.25);
            const angle = (positionInRing * 2 * Math.PI) / totalInThisRing + (ringIndex * 0.3);

            node.x = centerX + Math.cos(angle) * ringRadius;
            node.y = centerY + Math.sin(angle) * ringRadius;
        });

        // Mark that positions have been calculated
        this.nodesPositioned = true;
    }

    drawLinks() {
        console.log(`drawLinks called - attempting to draw ${this.links.length} links`);
        let drawnLinks = 0;
        this.links.forEach(link => {
            // Get coordinates from DOM elements instead of node objects
            const sourceElement = this.nodeGroup.querySelector(`[data-keyword="${link.source}"]`);
            const targetElement = this.nodeGroup.querySelector(`[data-keyword="${link.target}"]`);

            if (sourceElement && targetElement) {
                const sourceX = sourceElement.getAttribute('data-x');
                const sourceY = sourceElement.getAttribute('data-y');
                const targetX = targetElement.getAttribute('data-x');
                const targetY = targetElement.getAttribute('data-y');

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('class', 'link');
                line.setAttribute('x1', sourceX);
                line.setAttribute('y1', sourceY);
                line.setAttribute('x2', targetX);
                line.setAttribute('y2', targetY);
                line.setAttribute('stroke', '#999');
                line.setAttribute('stroke-opacity', '0.6');
                line.setAttribute('stroke-width', '1.5');

                this.linkGroup.appendChild(line);
                drawnLinks++;
                console.log(`Drew link: ${link.source} -> ${link.target} at (${sourceX},${sourceY}) to (${targetX},${targetY})`);
            } else {
                console.log(`Missing DOM element for link: ${link.source} -> ${link.target}`);
            }
        });
        console.log(`Successfully drew ${drawnLinks} out of ${this.links.length} links`);
    }

    drawNodes() {
        this.nodes.forEach(node => {
            // Create node group
            const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeGroup.setAttribute('class', 'node-group');
            nodeGroup.setAttribute('transform', `translate(${node.x},${node.y})`);

            // Create circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', `node ${node.type}`);
            circle.setAttribute('r', node.type === 'seed' ? 12 : 8);
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            circle.style.cursor = 'pointer';

            // Set fill color based on type
            const colors = {
                'seed': '#667eea',
                'discovered': '#48bb78',
                'undiscovered': '#e2e8f0'
            };
            circle.setAttribute('fill', colors[node.type] || colors['discovered']);

            // Set opacity for undiscovered nodes
            if (node.type === 'undiscovered') {
                circle.setAttribute('opacity', '0.4');
                circle.setAttribute('stroke', '#cbd5e0');
            }

            // Add click handler
            circle.addEventListener('click', () => this.showKeywordDetails(node));

            // Add hover effects
            circle.addEventListener('mouseover', () => {
                circle.setAttribute('r', node.type === 'seed' ? 15 : 11);
            });
            circle.addEventListener('mouseout', () => {
                circle.setAttribute('r', node.type === 'seed' ? 12 : 8);
            });

            // Create label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'node-label');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', node.type === 'seed' ? 20 : 16);
            text.setAttribute('font-family', 'Segoe UI, sans-serif');
            text.setAttribute('font-size', node.type === 'seed' ? '12px' : '10px');
            text.setAttribute('font-weight', node.type === 'seed' ? '600' : '500');
            text.setAttribute('fill', node.type === 'undiscovered' ? '#999' : '#333');
            text.style.pointerEvents = 'none';
            text.style.userSelect = 'none';

            // Set opacity for undiscovered node labels
            if (node.type === 'undiscovered') {
                text.setAttribute('opacity', '0.5');
            }

            const displayText = node.id.length > 15 ? node.id.substring(0, 12) + '...' : node.id;
            text.textContent = displayText;

            nodeGroup.appendChild(circle);
            nodeGroup.appendChild(text);
            this.nodeGroup.appendChild(nodeGroup);

            // Add entrance animation only for initial draw
            nodeGroup.style.opacity = '0';
            setTimeout(() => {
                nodeGroup.style.transition = 'opacity 0.5s';
                nodeGroup.style.opacity = '1';
            }, 100);

            // Store reference for later updates and preserve position
            nodeGroup.setAttribute('data-keyword', node.id);
            nodeGroup.setAttribute('data-x', node.x);
            nodeGroup.setAttribute('data-y', node.y);
        });
    }

    updateNodes() {
        let updatedCount = 0;
        this.nodes.forEach(node => {
            // Find existing node group
            const nodeGroup = this.nodeGroup.querySelector(`[data-keyword="${node.id}"]`);
            if (!nodeGroup) return;

            if (node.discovered) updatedCount++;

            // Skip position updates since positions should be fixed
            // Only update visual appearance, not position

            // Update circle appearance
            const circle = nodeGroup.querySelector('circle');
            if (circle) {
                // Update CSS class - this is crucial for color changes!
                circle.setAttribute('class', `node ${node.type}`);

                const colors = {
                    'seed': '#667eea',
                    'discovered': '#48bb78',
                    'undiscovered': '#e2e8f0'
                };

                const newColor = colors[node.type] || colors['discovered'];
                console.log(`Setting ${node.id} color to ${newColor} (type: ${node.type})`);

                circle.setAttribute('fill', newColor);
                circle.setAttribute('r', node.type === 'seed' ? 12 : 8);

                // Set opacity and stroke for undiscovered nodes
                if (node.type === 'undiscovered') {
                    circle.setAttribute('opacity', '0.4');
                    circle.setAttribute('stroke', '#cbd5e0');
                } else {
                    circle.setAttribute('opacity', '1');
                    circle.setAttribute('stroke', 'white');
                    circle.setAttribute('stroke-width', '2');
                }

                // Add animation for newly discovered nodes
                if (node.discovered && node.round > 0) {
                    circle.style.transition = 'fill 0.5s, opacity 0.5s, stroke 0.5s';
                }
            } else {
                console.log(`Circle not found for node ${node.id}`);
            }

            // Update text appearance
            const text = nodeGroup.querySelector('text');
            if (text) {
                text.setAttribute('fill', node.type === 'undiscovered' ? '#999' : '#333');
                text.setAttribute('opacity', node.type === 'undiscovered' ? '0.5' : '1');
                text.setAttribute('font-weight', node.type === 'seed' ? '600' : '500');
            }
        });
        console.log(`Updated visual appearance for ${updatedCount} discovered nodes out of ${this.nodes.length} total`);
    }

    prepareNetworkData() {
        // Convert all keywords to nodes (including undiscovered ones)
        this.nodes = Array.from(this.discoveredKeywords.entries()).map(([keyword, data]) => ({
            id: keyword,
            type: data.type,
            round: data.round,
            ...data
        }));

        // Create link set only for discovered keywords
        const discoveredKeywordSet = new Set(
            Array.from(this.discoveredKeywords.entries())
                .filter(([keyword, data]) => data.discovered)
                .map(([keyword, data]) => keyword)
        );

        console.log(`Discovered keywords for links:`, Array.from(discoveredKeywordSet));

        const linkMap = new Map();

        // Add predefined connections from JSON (only for discovered keywords)
        this.connections.forEach(conn => {
            if (discoveredKeywordSet.has(conn.source) && discoveredKeywordSet.has(conn.target)) {
                const linkKey = `${conn.source}-${conn.target}`;
                const reverseKey = `${conn.target}-${conn.source}`;
                if (!linkMap.has(linkKey) && !linkMap.has(reverseKey)) {
                    linkMap.set(linkKey, {
                        source: conn.source,
                        target: conn.target,
                        strength: conn.strength || 0.5
                    });
                }
            }
        });

        // Add connections based on "related" keywords (only for discovered keywords)
        this.nodes.filter(node => node.discovered).forEach(node => {
            if (node.related && Array.isArray(node.related)) {
                node.related.forEach(relatedKeyword => {
                    if (discoveredKeywordSet.has(relatedKeyword) && relatedKeyword !== node.id) {
                        const linkKey = `${node.id}-${relatedKeyword}`;
                        const reverseKey = `${relatedKeyword}-${node.id}`;
                        if (!linkMap.has(linkKey) && !linkMap.has(reverseKey)) {
                            linkMap.set(linkKey, {
                                source: node.id,
                                target: relatedKeyword,
                                strength: 0.4
                            });
                        }
                    }
                });
            }
        });

        this.links = Array.from(linkMap.values());
        console.log(`Created ${this.links.length} links for visualization`);

    }

    showKeywordDetails(nodeData) {
        const modal = document.getElementById('keywordModal');
        const modalKeyword = document.getElementById('modalKeyword');
        const modalRound = document.getElementById('modalRound');
        const modalConnections = document.getElementById('modalConnections');
        const modalExample = document.getElementById('modalExample');

        modalKeyword.textContent = nodeData.id;
        modalRound.textContent = nodeData.round === 0 ? 'Seed' : `Round ${nodeData.round}`;

        // Show connections
        modalConnections.innerHTML = '';
        nodeData.related.forEach(related => {
            if (this.discoveredKeywords.has(related)) {
                const tag = document.createElement('span');
                tag.className = 'connection-tag';
                tag.textContent = related;
                modalConnections.appendChild(tag);
            }
        });

        // Show example
        modalExample.textContent = nodeData.examples[0] || `Example usage of "${nodeData.id}"`;

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('keywordModal').style.display = 'none';
    }

    // Export Methods
    exportAsJson() {
        const data = {
            seedKeywords: Array.from(this.seedKeywords),
            discoveredKeywords: Object.fromEntries(this.discoveredKeywords),
            currentRound: this.currentRound,
            exportDate: new Date().toISOString()
        };

        this.downloadFile(
            JSON.stringify(data, null, 2),
            'snowball-sampling-results.json',
            'application/json'
        );
    }

    exportAsCsv() {
        const headers = ['Keyword', 'Round', 'Type', 'Related Keywords', 'Example'];
        const rows = [headers];

        this.discoveredKeywords.forEach((data, keyword) => {
            rows.push([
                keyword,
                data.round,
                data.type,
                data.related.join('; '),
                data.examples[0] || ''
            ]);
        });

        const csvContent = rows.map(row =>
            row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        this.downloadFile(csvContent, 'snowball-sampling-results.csv', 'text/csv');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Progress Plot Methods
    initializeProgressPlots() {
        this.totalProgressSvg = document.getElementById('totalProgressSvg');
        this.newProgressSvg = document.getElementById('newProgressSvg');

        if (!this.totalProgressSvg || !this.newProgressSvg) return;

        // Initialize with seed data
        const seedCount = this.seedKeywords.size;
        this.progressData = [{
            round: 0,
            total: seedCount,
            newThisRound: seedCount
        }];

        this.drawTotalProgressPlot();
        this.drawNewProgressPlot();
    }

    updateProgressPlots() {
        if (!this.totalProgressSvg || !this.newProgressSvg) return;

        const discoveredCount = Array.from(this.discoveredKeywords.values())
            .filter(kw => kw.discovered).length;

        const newThisRound = Array.from(this.discoveredKeywords.values())
            .filter(kw => kw.round === this.currentRound).length;

        // Update or add current round data
        const existingDataIndex = this.progressData.findIndex(d => d.round === this.currentRound);
        const roundData = {
            round: this.currentRound,
            total: discoveredCount,
            newThisRound: newThisRound
        };

        if (existingDataIndex >= 0) {
            this.progressData[existingDataIndex] = roundData;
        } else {
            this.progressData.push(roundData);
        }

        this.drawTotalProgressPlot();
        this.drawNewProgressPlot();
    }

    drawTotalProgressPlot() {
        if (!this.totalProgressSvg || this.progressData.length === 0) return;

        // Clear existing content
        this.totalProgressSvg.innerHTML = '';

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = this.totalProgressSvg.getBoundingClientRect().width - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Create main group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        this.totalProgressSvg.appendChild(g);

        // Calculate scales
        const maxRound = Math.max(...this.progressData.map(d => d.round));
        const maxTotal = Math.max(...this.progressData.map(d => d.total));

        const xScale = width / Math.max(maxRound, 1);
        const yScale = height / (maxTotal || 1);

        // Draw axes
        this.drawAxes(g, width, height, maxRound, maxTotal);

        // Draw total discovered line
        this.drawLine(g, this.progressData, 'total', xScale, yScale, height, '#667eea');
    }

    drawNewProgressPlot() {
        if (!this.newProgressSvg || this.progressData.length === 0) return;

        // Clear existing content
        this.newProgressSvg.innerHTML = '';

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = this.newProgressSvg.getBoundingClientRect().width - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Create main group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        this.newProgressSvg.appendChild(g);

        // Calculate scales
        const maxRound = Math.max(...this.progressData.map(d => d.round));
        const maxNew = Math.max(...this.progressData.map(d => d.newThisRound));

        const xScale = width / Math.max(maxRound, 1);
        const yScale = height / (maxNew || 1);

        // Draw axes
        this.drawAxes(g, width, height, maxRound, maxNew);

        // Draw new this round bars
        this.drawBars(g, this.progressData, 'newThisRound', xScale, yScale, height, '#48bb78');
    }

    drawAxes(g, width, height, maxX, maxY) {
        // X-axis
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', 0);
        xAxis.setAttribute('y1', height);
        xAxis.setAttribute('x2', width);
        xAxis.setAttribute('y2', height);
        xAxis.setAttribute('stroke', '#333');
        xAxis.setAttribute('stroke-width', '1');
        g.appendChild(xAxis);

        // Y-axis
        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', 0);
        yAxis.setAttribute('y1', 0);
        yAxis.setAttribute('x2', 0);
        yAxis.setAttribute('y2', height);
        yAxis.setAttribute('stroke', '#333');
        yAxis.setAttribute('stroke-width', '1');
        g.appendChild(yAxis);

        // X-axis labels
        for (let i = 0; i <= maxX; i++) {
            const x = (i * width) / Math.max(maxX, 1);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', height + 20);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12px');
            text.setAttribute('fill', '#666');
            text.textContent = i;
            g.appendChild(text);
        }

        // Y-axis labels
        const steps = 5;
        for (let i = 0; i <= steps; i++) {
            const y = height - (i * height) / steps;
            const value = Math.round((i * maxY) / steps);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', -10);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('font-size', '12px');
            text.setAttribute('fill', '#666');
            text.textContent = value;
            g.appendChild(text);
        }

        // Axis labels
        const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', width / 2);
        xLabel.setAttribute('y', height + 35);
        xLabel.setAttribute('text-anchor', 'middle');
        xLabel.setAttribute('font-size', '14px');
        xLabel.setAttribute('fill', '#333');
        xLabel.textContent = 'Round';
        g.appendChild(xLabel);

        const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yLabel.setAttribute('x', -35);
        yLabel.setAttribute('y', height / 2);
        yLabel.setAttribute('text-anchor', 'middle');
        yLabel.setAttribute('font-size', '14px');
        yLabel.setAttribute('fill', '#333');
        yLabel.setAttribute('transform', `rotate(-90, -35, ${height / 2})`);
        yLabel.textContent = 'Keywords';
        g.appendChild(yLabel);
    }

    drawLine(g, data, property, xScale, yScale, height, color) {
        if (data.length < 2) return;

        let pathData = '';
        data.forEach((d, i) => {
            const x = d.round * xScale;
            const y = height - (d[property] * yScale);
            pathData += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
        });

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        g.appendChild(path);

        // Add data points
        data.forEach(d => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', d.round * xScale);
            circle.setAttribute('cy', height - (d[property] * yScale));
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            g.appendChild(circle);
        });
    }

    drawBars(g, data, property, xScale, yScale, height, color) {
        const barWidth = Math.max(xScale * 0.6, 20);

        data.forEach(d => {
            if (d[property] > 0) {
                const x = d.round * xScale - barWidth / 2;
                const barHeight = d[property] * yScale;
                const y = height - barHeight;

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', barWidth);
                rect.setAttribute('height', barHeight);
                rect.setAttribute('fill', color);
                rect.setAttribute('opacity', '0.7');
                rect.setAttribute('stroke', color);
                rect.setAttribute('stroke-width', '1');
                g.appendChild(rect);
            }
        });
    }
}


// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnowballSamplingDemo();
});