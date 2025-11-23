// Component configurations
const components = {
  button: {
    name: 'Button',
    tag: 'apps-button',
    description: 'Interactive button component with multiple variants and states',
    controls: {
      variant: { type: 'select', options: ['solid', 'soft', 'outline', 'ghost'], default: 'solid' },
      color: { type: 'select', options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'discovery'], default: 'primary' },
      size: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      disabled: { type: 'boolean', default: false },
      loading: { type: 'boolean', default: false },
      pill: { type: 'boolean', default: false },
      text: { type: 'text', default: 'Click me' }
    },
    render: (props) => {
      const attrs = [];
      if (props.variant) attrs.push(`variant="${props.variant}"`);
      if (props.color) attrs.push(`color="${props.color}"`);
      if (props.size) attrs.push(`size="${props.size}"`);
      if (props.disabled) attrs.push('disabled');
      if (props.loading) attrs.push('loading');
      if (props.pill) attrs.push('pill');
      return `<apps-button ${attrs.join(' ')}>${props.text || 'Click me'}</apps-button>`;
    }
  },

  badge: {
    name: 'Badge',
    tag: 'apps-badge',
    description: 'Badge component for labels and status indicators',
    controls: {
      variant: { type: 'select', options: ['solid', 'soft', 'outline'], default: 'solid' },
      color: { type: 'select', options: ['secondary', 'success', 'danger', 'warning', 'info', 'discovery'], default: 'success' },
      size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      pill: { type: 'boolean', default: false },
      text: { type: 'text', default: 'Badge' }
    },
    render: (props) => {
      const attrs = [];
      if (props.variant) attrs.push(`variant="${props.variant}"`);
      if (props.color) attrs.push(`color="${props.color}"`);
      if (props.size) attrs.push(`size="${props.size}"`);
      if (props.pill) attrs.push('pill');
      return `<apps-badge ${attrs.join(' ')}>${props.text || 'Badge'}</apps-badge>`;
    }
  },

  input: {
    name: 'Input',
    tag: 'apps-input',
    description: 'Text input component with multiple variants and states',
    controls: {
      variant: { type: 'select', options: ['outline', 'soft'], default: 'outline' },
      size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      type: { type: 'select', options: ['text', 'email', 'password', 'number'], default: 'text' },
      placeholder: { type: 'text', default: 'Enter text...' },
      disabled: { type: 'boolean', default: false },
      invalid: { type: 'boolean', default: false },
      pill: { type: 'boolean', default: false }
    },
    render: (props) => {
      const attrs = ['style="width: 300px"'];
      if (props.variant) attrs.push(`variant="${props.variant}"`);
      if (props.size) attrs.push(`size="${props.size}"`);
      if (props.type) attrs.push(`type="${props.type}"`);
      if (props.placeholder) attrs.push(`placeholder="${props.placeholder}"`);
      if (props.disabled) attrs.push('disabled');
      if (props.invalid) attrs.push('invalid');
      if (props.pill) attrs.push('pill');
      return `<apps-input ${attrs.join(' ')}></apps-input>`;
    }
  },

  textarea: {
    name: 'Textarea',
    tag: 'apps-textarea',
    description: 'Multi-line text input with auto-resize capability',
    controls: {
      variant: { type: 'select', options: ['outline', 'soft'], default: 'outline' },
      size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      rows: { type: 'number', default: 3, min: 1, max: 10 },
      placeholder: { type: 'text', default: 'Enter text...' },
      disabled: { type: 'boolean', default: false },
      invalid: { type: 'boolean', default: false },
      'auto-resize': { type: 'boolean', default: false }
    },
    render: (props) => {
      const attrs = ['style="width: 300px"'];
      if (props.variant) attrs.push(`variant="${props.variant}"`);
      if (props.size) attrs.push(`size="${props.size}"`);
      if (props.rows) attrs.push(`rows="${props.rows}"`);
      if (props.placeholder) attrs.push(`placeholder="${props.placeholder}"`);
      if (props.disabled) attrs.push('disabled');
      if (props.invalid) attrs.push('invalid');
      if (props['auto-resize']) attrs.push('auto-resize');
      return `<apps-textarea ${attrs.join(' ')}></apps-textarea>`;
    }
  },

  checkbox: {
    name: 'Checkbox',
    tag: 'apps-checkbox',
    description: 'Checkbox input with label support',
    controls: {
      label: { type: 'text', default: 'Checkbox label' },
      checked: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      indeterminate: { type: 'boolean', default: false },
      orientation: { type: 'select', options: ['left', 'right'], default: 'left' }
    },
    render: (props) => {
      const attrs = [];
      if (props.label) attrs.push(`label="${props.label}"`);
      if (props.checked && !props.indeterminate) attrs.push('checked');
      if (props.indeterminate) attrs.push('checked="indeterminate"');
      if (props.disabled) attrs.push('disabled');
      if (props.orientation) attrs.push(`orientation="${props.orientation}"`);
      return `<apps-checkbox ${attrs.join(' ')}></apps-checkbox>`;
    }
  },

  radio: {
    name: 'Radio',
    tag: 'apps-radio',
    description: 'Radio button for single-selection groups',
    controls: {
      label: { type: 'text', default: 'Radio option' },
      name: { type: 'text', default: 'demo-group' },
      value: { type: 'text', default: 'option1' },
      checked: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      orientation: { type: 'select', options: ['left', 'right'], default: 'left' }
    },
    render: (props) => {
      const attrs = [];
      if (props.label) attrs.push(`label="${props.label}"`);
      if (props.name) attrs.push(`name="${props.name}"`);
      if (props.value) attrs.push(`value="${props.value}"`);
      if (props.checked) attrs.push('checked');
      if (props.disabled) attrs.push('disabled');
      if (props.orientation) attrs.push(`orientation="${props.orientation}"`);
      return `<apps-radio ${attrs.join(' ')}></apps-radio>`;
    }
  },

  switch: {
    name: 'Switch',
    tag: 'apps-switch',
    description: 'Toggle switch component',
    controls: {
      label: { type: 'text', default: 'Switch label' },
      checked: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      'label-position': { type: 'select', options: ['start', 'end'], default: 'end' }
    },
    render: (props) => {
      const attrs = [];
      if (props.label) attrs.push(`label="${props.label}"`);
      if (props.checked) attrs.push('checked');
      if (props.disabled) attrs.push('disabled');
      if (props['label-position']) attrs.push(`label-position="${props['label-position']}"`);
      return `<apps-switch ${attrs.join(' ')}></apps-switch>`;
    }
  }
};

// State
let currentComponent = null;
let currentProps = {};

// Initialize
function init() {
  renderComponentList();
}

// Render component list
function renderComponentList() {
  const list = document.getElementById('componentList');
  list.innerHTML = Object.keys(components)
    .sort()
    .map(key => {
      const comp = components[key];
      return `
        <div class="component-item" data-component="${key}">
          ${comp.name}
        </div>
      `;
    })
    .join('');

  // Add click handlers
  list.querySelectorAll('.component-item').forEach(item => {
    item.addEventListener('click', () => {
      const componentKey = item.dataset.component;
      selectComponent(componentKey);
    });
  });
}

// Select component
function selectComponent(key) {
  currentComponent = key;
  const comp = components[key];

  // Update active state
  document.querySelectorAll('.component-item').forEach(item => {
    item.classList.toggle('active', item.dataset.component === key);
  });

  // Update title
  document.getElementById('componentTitle').textContent = comp.name;

  // Initialize props with defaults
  currentProps = {};
  Object.keys(comp.controls).forEach(controlKey => {
    const control = comp.controls[controlKey];
    currentProps[controlKey] = control.default;
  });

  // Render playground
  renderPlayground();
}

// Render playground
function renderPlayground() {
  const comp = components[currentComponent];
  const playground = document.getElementById('playground');

  const controlsHTML = Object.keys(comp.controls).map(key => {
    const control = comp.controls[key];
    return renderControl(key, control);
  }).join('');

  playground.innerHTML = `
    <div class="playground-section">
      <div class="section-title">⚙️ Props Controls</div>
      <div class="controls-grid">
        ${controlsHTML}
      </div>
    </div>

    <div class="playground-section">
      <div class="section-title">👁️ Preview</div>
      <div class="preview-container" id="preview">
        ${comp.render(currentProps)}
      </div>
    </div>

    <div class="playground-section">
      <div class="section-title">💻 Code</div>
      <div class="code-section">
        <div class="code-header">
          <span class="code-label">HTML</span>
          <button class="copy-button" onclick="copyCode()">Copy</button>
        </div>
        <div class="code-block">
          <code id="codeOutput">${escapeHtml(comp.render(currentProps))}</code>
        </div>
      </div>
    </div>

    <div class="playground-section">
      <div class="section-title">🎨 All Variants</div>
      <div id="variantsContainer"></div>
    </div>
  `;

  // Add control listeners
  attachControlListeners();

  // Render variants
  renderVariants();
}

// Render control
function renderControl(key, control) {
  const id = `control-${key}`;
  const label = key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  switch (control.type) {
    case 'select':
      return `
        <div class="control-group">
          <label class="control-label" for="${id}">${label}</label>
          <select id="${id}" class="control-input" data-prop="${key}">
            ${control.options.map(opt =>
              `<option value="${opt}" ${opt === control.default ? 'selected' : ''}>${opt}</option>`
            ).join('')}
          </select>
        </div>
      `;

    case 'boolean':
      return `
        <div class="control-group">
          <label class="control-checkbox">
            <input type="checkbox" id="${id}" data-prop="${key}" ${control.default ? 'checked' : ''}>
            <span class="control-label">${label}</span>
          </label>
        </div>
      `;

    case 'text':
      return `
        <div class="control-group">
          <label class="control-label" for="${id}">${label}</label>
          <input type="text" id="${id}" class="control-input" data-prop="${key}" value="${control.default || ''}">
        </div>
      `;

    case 'number':
      return `
        <div class="control-group">
          <label class="control-label" for="${id}">${label}</label>
          <input type="number" id="${id}" class="control-input" data-prop="${key}"
                 value="${control.default || 0}"
                 min="${control.min || 0}"
                 max="${control.max || 100}">
        </div>
      `;

    default:
      return '';
  }
}

// Attach control listeners
function attachControlListeners() {
  document.querySelectorAll('[data-prop]').forEach(input => {
    const prop = input.dataset.prop;
    input.addEventListener('change', () => {
      if (input.type === 'checkbox') {
        currentProps[prop] = input.checked;
      } else if (input.type === 'number') {
        currentProps[prop] = parseInt(input.value, 10);
      } else {
        currentProps[prop] = input.value;
      }
      updatePreview();
    });
    input.addEventListener('input', () => {
      if (input.type === 'text') {
        currentProps[prop] = input.value;
        updatePreview();
      }
    });
  });
}

// Update preview
function updatePreview() {
  const comp = components[currentComponent];
  const html = comp.render(currentProps);

  document.getElementById('preview').innerHTML = html;
  document.getElementById('codeOutput').textContent = html;
}

// Render variants
function renderVariants() {
  const comp = components[currentComponent];
  const container = document.getElementById('variantsContainer');

  // For now, show different color/variant combinations
  const variantProp = comp.controls.variant ? 'variant' : null;
  const colorProp = comp.controls.color ? 'color' : null;

  if (!variantProp && !colorProp) {
    container.innerHTML = '<p style="color: #6b7280;">No variants available for this component</p>';
    return;
  }

  const variants = [];

  if (colorProp) {
    comp.controls.color.options.forEach(color => {
      const props = { ...currentProps, color };
      variants.push({
        label: color,
        html: comp.render(props)
      });
    });
  } else if (variantProp) {
    comp.controls.variant.options.forEach(variant => {
      const props = { ...currentProps, variant };
      variants.push({
        label: variant,
        html: comp.render(props)
      });
    });
  }

  container.innerHTML = `
    <div class="variants-grid">
      ${variants.map(v => `
        <div class="variant-item">
          <div class="variant-label">${v.label}</div>
          ${v.html}
        </div>
      `).join('')}
    </div>
  `;
}

// Copy code
function copyCode() {
  const code = document.getElementById('codeOutput').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.copy-button');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
