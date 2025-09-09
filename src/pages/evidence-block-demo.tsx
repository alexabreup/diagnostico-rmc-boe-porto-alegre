import React from 'react';
import Layout from '@theme/Layout';
import EvidenceBlock from '../components/EvidenceBlock';

export default function EvidenceBlockDemo(): JSX.Element {
  const codeExample = `// Firmware analysis code
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  // Initialize EEPROM
  EEPROM.begin(512);
  
  // Read configuration
  config_t config;
  EEPROM.get(0, config);
  
  if (config.magic != CONFIG_MAGIC) {
    // Initialize default config
    config.magic = CONFIG_MAGIC;
    config.brightness = 128;
    config.schedule_enabled = true;
    EEPROM.put(0, config);
    EEPROM.commit();
  }
}`;

  const logExample = `[2025-01-07 14:32:15] INFO: RMC System startup initiated
[2025-01-07 14:32:15] DEBUG: EEPROM initialization started
[2025-01-07 14:32:16] ERROR: EEPROM checksum mismatch at address 0x100
[2025-01-07 14:32:16] WARN: Falling back to default configuration
[2025-01-07 14:32:16] INFO: LCD display initialized successfully
[2025-01-07 14:32:17] INFO: Network interface configured (IP: 192.168.1.100)
[2025-01-07 14:32:17] INFO: System ready for operation`;

  const dataExample = `Voltage Measurements (V):
Pin 1: 3.287 ± 0.005
Pin 2: 5.012 ± 0.008
Pin 3: 0.000 ± 0.001

Current Measurements (mA):
Total: 245.7 ± 2.1
LCD: 89.3 ± 1.5
MCU: 156.4 ± 0.8

Temperature: 42.3°C ± 0.2°C
Humidity: 65.8% ± 1.2%`;

  const hexDumpExample = `0000: 4D 44 31 31 30 35 00 00  FF FF FF FF 80 01 00 00  MD1105..........
0010: 12 34 56 78 9A BC DE F0  00 11 22 33 44 55 66 77  .4Vx......."3DUfw
0020: A5 5A C3 3C F0 0F AA 55  12 21 34 43 56 65 78 87  .Z.<...U.!4CVexg
0030: FF 00 FF 00 AA 55 CC 33  EE 11 DD 22 BB 44 99 66  .....U.3..."D.f`;

  return (
    <Layout
      title="EvidenceBlock Component Demo"
      description="Demonstration of the EvidenceBlock component for technical documentation"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>EvidenceBlock Component Demo</h1>
            <p>
              The EvidenceBlock component is designed for displaying technical
              evidence in hardware diagnostic documentation. It supports
              different types of evidence with appropriate formatting and syntax
              highlighting.
            </p>

            <h2>Code Evidence</h2>
            <p>For displaying source code with syntax highlighting:</p>
            <EvidenceBlock
              title="Firmware Initialization Code"
              type="code"
              language="cpp"
            >
              {codeExample}
            </EvidenceBlock>

            <h2>Log Evidence</h2>
            <p>For displaying system logs and debug output:</p>
            <EvidenceBlock title="System Startup Logs" type="log">
              {logExample}
            </EvidenceBlock>

            <h2>Data Evidence</h2>
            <p>For displaying measurement data and technical specifications:</p>
            <EvidenceBlock title="Electrical Measurements" type="data">
              {dataExample}
            </EvidenceBlock>

            <h2>Hex Dump Evidence</h2>
            <p>For displaying binary data and memory dumps:</p>
            <EvidenceBlock
              title="EEPROM Memory Dump"
              type="data"
              language="hexdump"
            >
              {hexDumpExample}
            </EvidenceBlock>

            <h2>Without Title</h2>
            <p>
              Evidence blocks can also be used without titles for inline
              evidence:
            </p>
            <EvidenceBlock type="code">
              {`#define CONFIG_MAGIC 0x12345678
#define LED_PIN 13`}
            </EvidenceBlock>

            <h2>React Content</h2>
            <p>Evidence blocks can also contain React components:</p>
            <EvidenceBlock title="Interactive Content" type="data">
              <div>
                <p>
                  <strong>Analysis Results:</strong>
                </p>
                <ul>
                  <li>EEPROM corruption detected at sector 2</li>
                  <li>Voltage regulation within acceptable range</li>
                  <li>Temperature sensors functioning normally</li>
                </ul>
                <p>
                  <em>Confidence Level: 95.7%</em>
                </p>
              </div>
            </EvidenceBlock>

            <h2>Custom Styling</h2>
            <p>Evidence blocks support custom CSS classes:</p>
            <EvidenceBlock
              title="Custom Styled Evidence"
              type="code"
              className="custom-evidence-style"
            >
              {`// This evidence block has custom styling applied
console.log("Custom styling example");`}
            </EvidenceBlock>

            <style jsx>{`
              .custom-evidence-style {
                border: 2px dashed var(--ifm-color-primary);
                border-radius: 12px;
              }
            `}</style>
          </div>
        </div>
      </div>
    </Layout>
  );
}
