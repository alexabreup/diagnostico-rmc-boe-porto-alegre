/**
 * Performance Monitor Component
 * Tracks and reports performance metrics for the technical platform
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

import React, { useEffect, useState } from 'react';
import './styles.css';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  bundleSize?: number;
  chunkCount?: number;
  resourceCount?: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showMetrics?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export default function PerformanceMonitor({
  enabled = process.env.NODE_ENV === 'development',
  showMetrics = false,
  onMetricsUpdate
}: PerformanceMonitorProps): JSX.Element | null {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const collectMetrics = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        const firstContentfulPaint = fcp ? fcp.startTime : 0;

        // Get LCP from PerformanceObserver if available
        let largestContentfulPaint = 0;
        let cumulativeLayoutShift = 0;
        let firstInputDelay = 0;

        // LCP Observer
        if ('PerformanceObserver' in window) {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              largestContentfulPaint = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // CLS Observer
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  cumulativeLayoutShift += (entry as any).value;
                }
              }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // FID Observer
            const fidObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                firstInputDelay = (entry as any).processingStart - entry.startTime;
              }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
          } catch (error) {
            console.warn('Performance Observer not fully supported:', error);
          }
        }

        const performanceMetrics: PerformanceMetrics = {
          loadTime,
          domContentLoaded,
          firstContentfulPaint,
          largestContentfulPaint,
          cumulativeLayoutShift,
          firstInputDelay
        };

        setMetrics(performanceMetrics);
        onMetricsUpdate?.(performanceMetrics);

        // Log metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🚀 Performance Metrics - Diagnóstico RMC Platform');
          console.log('Load Time:', `${loadTime.toFixed(2)}ms`);
          console.log('DOM Content Loaded:', `${domContentLoaded.toFixed(2)}ms`);
          console.log('First Contentful Paint:', `${firstContentfulPaint.toFixed(2)}ms`);
          console.log('Largest Contentful Paint:', `${largestContentfulPaint.toFixed(2)}ms`);
          console.log('Cumulative Layout Shift:', cumulativeLayoutShift.toFixed(4));
          console.log('First Input Delay:', `${firstInputDelay.toFixed(2)}ms`);
          console.groupEnd();
        }

      } catch (error) {
        console.warn('Failed to collect performance metrics:', error);
      }
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(collectMetrics, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(collectMetrics, 100);
      });
    }

    // Keyboard shortcut to toggle metrics display (Ctrl+Shift+P)
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled, onMetricsUpdate]);

  if (!enabled || (!showMetrics && !isVisible) || !metrics) {
    return null;
  }

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  const formatTime = (time: number) => `${time.toFixed(2)}ms`;

  return (
    <div className="performance-monitor">
      <div className="performance-monitor__header">
        <h4>⚡ Performance Metrics</h4>
        <button 
          className="performance-monitor__close"
          onClick={() => setIsVisible(false)}
          aria-label="Close performance monitor"
        >
          ×
        </button>
      </div>
      
      <div className="performance-monitor__metrics">
        <div className="performance-metric">
          <span className="performance-metric__label">Load Time</span>
          <span className={`performance-metric__value ${getScoreColor(metrics.loadTime, [1000, 3000])}`}>
            {formatTime(metrics.loadTime)}
          </span>
        </div>

        <div className="performance-metric">
          <span className="performance-metric__label">DOM Ready</span>
          <span className={`performance-metric__value ${getScoreColor(metrics.domContentLoaded, [800, 1800])}`}>
            {formatTime(metrics.domContentLoaded)}
          </span>
        </div>

        <div className="performance-metric">
          <span className="performance-metric__label">FCP</span>
          <span className={`performance-metric__value ${getScoreColor(metrics.firstContentfulPaint, [1800, 3000])}`}>
            {formatTime(metrics.firstContentfulPaint)}
          </span>
        </div>

        {metrics.largestContentfulPaint > 0 && (
          <div className="performance-metric">
            <span className="performance-metric__label">LCP</span>
            <span className={`performance-metric__value ${getScoreColor(metrics.largestContentfulPaint, [2500, 4000])}`}>
              {formatTime(metrics.largestContentfulPaint)}
            </span>
          </div>
        )}

        {metrics.cumulativeLayoutShift > 0 && (
          <div className="performance-metric">
            <span className="performance-metric__label">CLS</span>
            <span className={`performance-metric__value ${getScoreColor(metrics.cumulativeLayoutShift, [0.1, 0.25])}`}>
              {metrics.cumulativeLayoutShift.toFixed(4)}
            </span>
          </div>
        )}

        {metrics.firstInputDelay > 0 && (
          <div className="performance-metric">
            <span className="performance-metric__label">FID</span>
            <span className={`performance-metric__value ${getScoreColor(metrics.firstInputDelay, [100, 300])}`}>
              {formatTime(metrics.firstInputDelay)}
            </span>
          </div>
        )}
      </div>

      <div className="performance-monitor__footer">
        <small>Press Ctrl+Shift+P to toggle • Alexandre de Abreu Pereira - Eletromidia Hardware</small>
      </div>
    </div>
  );
}