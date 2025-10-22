import { useTheme } from '../../contexts/ThemeContext';
import './ThemePreview.css';

function ThemePreview() {
  const { isDarkMode, theme } = useTheme();

  return (
    <div className="theme-preview-container">
      <div className="theme-info">
        <h3>Current Theme: <span className="theme-name">{theme}</span></h3>
        <p>Switch between light and dark modes using the toggle button in the header!</p>
      </div>
      
      <div className="preview-grid">
        <div className="preview-card">
          <h4>Cards & Components</h4>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Sample Article</h5>
              <p className="card-text">This is a sample article card that demonstrates how content looks in the current theme.</p>
              <button className="custom-btn">Read More</button>
            </div>
          </div>
        </div>

        <div className="preview-card">
          <h4>Form Elements</h4>
          <div className="form-group">
            <label htmlFor="sampleInput">Sample Input</label>
            <input 
              type="text" 
              className="form-control" 
              id="sampleInput" 
              placeholder="Enter some text..."
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="sampleSelect">Sample Select</label>
            <select className="form-select" id="sampleSelect">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>

        <div className="preview-card">
          <h4>Colors & Typography</h4>
          <div className="color-samples">
            <div className="color-sample primary">Primary Background</div>
            <div className="color-sample secondary">Secondary Background</div>
            <div className="color-sample text-primary">Primary Text</div>
            <div className="color-sample text-secondary">Secondary Text</div>
            <div className="color-sample success">Success Color</div>
            <div className="color-sample link">Link Color</div>
          </div>
        </div>

        <div className="preview-card">
          <h4>Interactive Elements</h4>
          <div className="button-group">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-outline-success">Outline Button</button>
            <button className="custom-btn">Custom Button</button>
          </div>
          <div className="mt-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="sampleCheck" />
              <label className="form-check-label" htmlFor="sampleCheck">
                Sample Checkbox
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemePreview;
