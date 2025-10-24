// Configuration
const API_CONFIG = {
    baseUrl: 'https://apis.iflow.cn/v1',
    models: [
        {
            name: 'GLM-4.6',
            model: 'glm-4.6',
            baseUrl: 'https://apis.iflow.cn/v1',
        },
        {
            name: 'qwen3-max',
            model: 'qwen3-max',
            baseUrl: 'https://apis.iflow.cn/v1',
        },
        {
            name: 'qwen3-coder',
            model: 'qwen3-coder-plus',
            baseUrl: 'https://apis.iflow.cn/v1',
        },
        {
            name: 'tbao',
            model: 'tstars2.0',
            baseUrl: 'https://apis.iflow.cn/v1',
        },
        {
            name: 'kimi-k2',
            model: 'kimi-k2-0905',
            baseUrl: 'https://apis.iflow.cn/v1',
        },
    ]
};

// State management
let currentResults = [];
let isGenerating = false;
let currentCodeForModal = '';
let activeTypingAnimations = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkEmptyState();
    console.log('AI Website Builder initialized');
});

function initializeEventListeners() {
    // Enter key shortcut
    document.getElementById('promptInput').addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generateWebsites();
        }
    });

    document.getElementById('generateBtn').addEventListener('click', generateWebsites);

    // Close modal on outside click
    document.getElementById('codeModal').addEventListener('click', (e) => {
        if (e.target.id === 'codeModal') {
            closeModal();
        }
    });

    // Close fullscreen on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFullscreen();
        }
    });
}

async function generateWebsites() {
    const prompt = document.getElementById('promptInput').value.trim();

    if (!prompt) {
        showToast('Please enter a website description', 'error');
        return;
    }

    if (isGenerating) {
        showToast('Generation already in progress', 'warning');
        return;
    }

    console.log('Starting generation with prompt:', prompt);

    isGenerating = true;
    const generateBtn = document.getElementById('generateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const emptyState = document.getElementById('emptyState');
    const progressSection = document.getElementById('progressSection');

    // Update UI states
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    generateBtn.querySelector('.btn-text').textContent = 'Generating...';
    emptyState.style.display = 'none';
    progressSection.style.display = 'block';

    // Clear previous results
    resultsContainer.innerHTML = '';
    currentResults = [];

    // Clear any active typing animations
    Object.values(activeTypingAnimations).forEach(animation => clearInterval(animation));
    activeTypingAnimations = {};

    // Animate LLM badges
    const badges = document.querySelectorAll('.llm-badge');
    badges.forEach(badge => badge.classList.remove('active'));

    try {
        const models = API_CONFIG.models;
        const totalModels = models.length;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            console.log(`Processing model ${i + 1}/${totalModels}: ${model.name}`);

            // Update progress
            updateProgress((i / totalModels) * 100, `Generating with ${model.name}...`);

            // Activate current badge
            if (badges[i]) badges[i].classList.add('active');

            // Create result card with loading state
            const cardId = `result-${i}`;
            const card = createResultCard({
                id: cardId,
                llm: model.name,
                status: 'loading',
                html: ''
            });
            resultsContainer.appendChild(card);

            try {
                // Generate HTML with the model and show live coding
                await generateWithModelLive(model, prompt, cardId);

            } catch (error) {
                console.error(`Error with ${model.name}:`, error);
                updateResultCard(cardId, {
                    llm: model.name,
                    status: 'error',
                    error: error.message || 'Unknown error occurred'
                });
            }

            // Deactivate badge
            if (badges[i]) badges[i].classList.remove('active');
        }

        updateProgress(100, 'Generation complete!');
        showToast('All websites generated successfully!', 'success');

    } catch (error) {
        console.error('Generation error:', error);
        showToast('Failed to generate websites: ' + error.message, 'error');
    } finally {
        // Reset UI states
        isGenerating = false;
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
        generateBtn.querySelector('.btn-text').textContent = 'Generate Websites';

        setTimeout(() => {
            progressSection.style.display = 'none';
        }, 2000);
    }
}

async function generateWithModelLive(model, prompt, cardId) {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        showToast('Please enter your API key', 'error');
        throw new Error('API Key is required.');
    }
    const systemPrompt = `You are an expert web developer. Generate complete, valid HTML code for the requested website.
Include inline CSS styles within a <style> tag in the <head>. The design should be modern, clean, and visually appealing.
Ensure the HTML is well-structured and the CSS is self-contained. Do not include any JavaScript unless specifically requested.
The entire output must be a single HTML file. No external files.

User Request: "${prompt}"`;

    try {
        const response = await fetch(model.baseUrl + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullHtml = '';

        showLiveCoding(cardId, model.name);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(6);
                    if (jsonStr === '[DONE]') {
                        break;
                    }
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                            const content = data.choices[0].delta.content;
                            fullHtml += content;
                            // Update UI periodically
                            if (fullHtml.length % 50 === 0) {
                                await typingEffect(cardId, fullHtml, model.name, false);
                            }
                        }
                    } catch (e) {
                        // Ignore JSON parsing errors for incomplete chunks
                    }
                }
            }
        }

        // Final update with the complete HTML
        await typingEffect(cardId, fullHtml, model.name, true);

    } catch (error) {
        console.error(`API call failed for ${model.name}:`, error);
        // Fallback to a template on API failure
        const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
        .card { border: 1px solid #ccc; padding: 20px; margin: 10px; display: inline-block; }
    </style>
</head>
<body>
    <h1>Generated Website</h1>
    <p>${prompt}</p>
    <div class="card">
        <h3>Feature 1</h3>
        <p>Modern and responsive design</p>
    </div>
    <div class="card">
        <h3>Feature 2</h3>
        <p>Clean and professional layout</p>
    </div>
    <div class="card">
        <h3>Feature 3</h3>
        <p>Customizable content</p>
    </div>
    <p><em>Note: API connection failed. This is a fallback template.</em></p>
    <p><strong>Model: ${model.name}</strong></p>
</body>
</html>`;
        await typingEffect(cardId, fallbackHtml, model.name, true);
    }
}

function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.id = result.id;

    if (result.status === 'loading') {
        card.innerHTML = `
            <div class="result-header">
                <span class="result-title">${result.llm}</span>
                <span class="status-loading">Generating...</span>
            </div>
            <div class="result-body">
                <div class="loader"></div>
            </div>
        `;
    }

    return card;
}

function showLiveCoding(cardId, llmName) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const uniqueId = cardId.replace('result-', '');

    card.innerHTML = `
        <div class="result-header">
            <span class="result-title">${llmName}</span>
            <div class="tabs">
                <button class="tab active" onclick="switchTab('${uniqueId}', 'preview')">Preview</button>
                <button class="tab" onclick="switchTab('${uniqueId}', 'code')">Code</button>
            </div>
        </div>
        <div class="result-body">
            <div id="preview-${uniqueId}" class="tab-content active">
                <iframe id="iframe-${uniqueId}"></iframe>
            </div>
            <div id="code-${uniqueId}" class="tab-content">
                <pre class="code-block" id="code-block-${uniqueId}"><code id="code-text-${uniqueId}"></code></pre>
            </div>
        </div>
        <div class="result-footer">
            <button onclick="openFullscreen('${uniqueId}', '${llmName}')">Fullscreen</button>
            <button onclick="copyCode('${uniqueId}')">Copy Code</button>
            <button onclick="downloadHTML('${uniqueId}', '${llmName}')">Download</button>
        </div>
    `;
}

async function typingEffect(cardId, html, llmName, isComplete) {
    const uniqueId = cardId.replace('result-', '');
    const codeElement = document.getElementById(`code-text-${uniqueId}`);
    const codeBlock = document.getElementById(`code-block-${uniqueId}`);

    if (!codeElement) {
        console.warn(`Code element not found for ${cardId}`);
        return;
    }

    // Use a simple text update for performance
    codeElement.textContent = html;

    if (codeBlock) {
        codeBlock.scrollTop = codeBlock.scrollHeight;
    }

    updatePreviewDuringTyping(uniqueId, html);

    if (isComplete) {
        updateResultCard(cardId, {
            llm: llmName,
            status: 'success',
            html: html
        });

        currentResults.push({
            llm: llmName,
            html: html
        });

        console.log(`Generation complete for ${llmName}`);
    }
}

function updatePreviewDuringTyping(uniqueId, partialHtml) {
    const iframe = document.getElementById(`iframe-${uniqueId}`);
    if (iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(partialHtml);
            iframeDoc.close();
        } catch (e) {
            console.debug('Preview update error (expected):', e.message);
        }
    }
}

function updateResultCard(cardId, result) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const uniqueId = cardId.replace('result-', '');

    if (result.status === 'success') {
        const codeElement = document.getElementById(`code-text-${uniqueId}`);
        if (codeElement) {
            codeElement.textContent = result.html;
        }

        // Final load into iframe to ensure all scripts run if any
        setTimeout(() => {
            updatePreviewDuringTyping(uniqueId, result.html);
        }, 100);

        if (!window.generatedHTML) window.generatedHTML = {};
        window.generatedHTML[uniqueId] = result.html;

    } else {
        card.innerHTML = `
            <div class="result-header">
                <span class="result-title">${result.llm}</span>
                <span class="status-error">✗ Error</span>
            </div>
            <div class="result-body">
                <p>Failed to generate website</p>
                <p>${result.error || 'Unknown error'}</p>
                <p>Check console for details (F12)</p>
            </div>
        `;
    }
}

function openFullscreen(uniqueId, llmName) {
    const html = window.generatedHTML[uniqueId];
    if (html) {
        const fullscreenPreview = document.getElementById('fullscreenPreview');
        const fullscreenIframe = document.getElementById('fullscreenIframe');
        const llmNameElement = document.getElementById('fullscreenLLMName');

        llmNameElement.textContent = llmName;

        const iframeDoc = fullscreenIframe.contentDocument || fullscreenIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        fullscreenPreview.classList.add('show');
        document.getElementById('fullscreenBody').className = 'fullscreen-body desktop';
    }
}

function closeFullscreen() {
    document.getElementById('fullscreenPreview').classList.remove('show');
}

function toggleDeviceView(device) {
    document.getElementById('fullscreenBody').className = `fullscreen-body ${device}`;
}

function switchTab(cardId, tabName) {
    const card = document.getElementById(`result-${cardId}`);
    if (!card) return;

    const contents = card.querySelectorAll('.tab-content');
    const tabs = card.querySelectorAll('.tab');

    contents.forEach(content => content.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));

    card.querySelector(`#${tabName}-${cardId}`).classList.add('active');

    const clickedTab = tabName === 'preview' ? tabs[0] : tabs[1];
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
}

function copyCode(id) {
    const html = window.generatedHTML[id];
    if (html) {
        navigator.clipboard.writeText(html).then(() => {
            showToast('Code copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy code', 'error');
        });
    }
}

function downloadHTML(id, llmName) {
    const html = window.generatedHTML[id];
    if (html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${llmName.toLowerCase().replace(/\s+/g, '-')}-website.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('HTML file downloaded!', 'success');
    }
}

function viewFullCode(id) {
    const html = window.generatedHTML[id];
    if (html) {
        currentCodeForModal = html;
        document.getElementById('modalCode').textContent = html;
        document.getElementById('codeModal').classList.add('show');
    }
}

function closeModal() {
    document.getElementById('codeModal').classList.remove('show');
}

function copyModalCode() {
    if (currentCodeForModal) {
        navigator.clipboard.writeText(currentCodeForModal).then(() => {
            showToast('Code copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy code', 'error');
        });
    }
}

function downloadCode() {
    if (currentCodeForModal) {
        const blob = new Blob([currentCodeForModal], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('HTML file downloaded!', 'success');
    }
}

function updateProgress(percentage, text) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = text;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function checkEmptyState() {
    const resultsContainer = document.getElementById('resultsContainer');
    const emptyState = document.getElementById('emptyState');

    if (resultsContainer.children.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Example prompts for quick testing
const examplePrompts = [
    "Create a modern portfolio website for a photographer with dark theme",
    "Build a colorful landing page for a children's toy store",
    "Design a minimalist blog website with a clean white design",
    "Create a tech startup landing page with animations",
    "Build a restaurant website with menu and reservation form"
];

// Add example prompt on double-click of textarea placeholder
document.getElementById('promptInput').addEventListener('dblclick', function () {
    if (this.value === '') {
        this.value = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
        showToast('Example prompt added!', 'success');
    }
});
