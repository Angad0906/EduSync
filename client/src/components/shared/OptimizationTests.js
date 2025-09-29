/**
 * Optimization Tests
 * 
 * Test suite for verifying performance optimizations and cross-browser
 * compatibility features work correctly.
 */

import { 
  FeatureDetection, 
  PerformanceUtils, 
  CSSUtils,
  initializeCrossBrowserSupport 
} from './CrossBrowserUtils';
import { PerformanceMonitor } from './PerformanceMonitor';

/**
 * Test suite for feature detection
 */
export const testFeatureDetection = () => {
  console.group('Feature Detection Tests');
  
  const tests = [
    {
      name: 'Backdrop Filter Support',
      test: () => FeatureDetection.supportsBackdropFilter(),
      expected: 'boolean'
    },
    {
      name: 'CSS Grid Support',
      test: () => FeatureDetection.supportsGrid(),
      expected: 'boolean'
    },
    {
      name: 'Custom Properties Support',
      test: () => FeatureDetection.supportsCustomProperties(),
      expected: 'boolean'
    },
    {
      name: 'Intersection Observer Support',
      test: () => FeatureDetection.supportsIntersectionObserver(),
      expected: 'boolean'
    },
    {
      name: 'Reduced Motion Preference',
      test: () => FeatureDetection.prefersReducedMotion(),
      expected: 'boolean'
    },
    {
      name: 'Low End Device Detection',
      test: () => FeatureDetection.isLowEndDevice(),
      expected: 'boolean'
    },
    {
      name: 'Browser Info',
      test: () => FeatureDetection.getBrowserInfo(),
      expected: 'object'
    }
  ];

  tests.forEach(({ name, test, expected }) => {
    try {
      const result = test();
      const isCorrectType = typeof result === expected;' : '(FAIL - wrong type)');
    } catch (error) {
      console.error(`✗ ${name}: ERROR -`, error.message);
    }
  });
  
  console.groupEnd();
};

/**
 * Test suite for performance utilities
 */
export const testPerformanceUtils = () => {
  console.group('Performance Utils Tests');
  
  // Test debounce
  let debounceCount = 0;
  const debouncedFn = PerformanceUtils.debounce(() => {
    debounceCount++;
  }, 100);
  
  // Call multiple times quickly
  debouncedFn();
  debouncedFn();
  debouncedFn();
  
  setTimeout(() => {`);
  }, 150);
  
  // Test throttle
  let throttleCount = 0;
  const throttledFn = PerformanceUtils.throttle(() => {
    throttleCount++;
  }, 100);
  
  // Call multiple times quickly
  throttledFn();
  throttledFn();
  throttledFn();
  
  setTimeout(() => {`);
  }, 50);
  
  // Test requestAnimationFrame
  try {
    const rafId = PerformanceUtils.requestAnimationFrame(() => {});
    
    if (typeof rafId === 'number') {
      PerformanceUtils.cancelAnimationFrame(rafId);}
  } catch (error) {
    console.error('✗ Animation frame tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for CSS utilities
 */
export const testCSSUtils = () => {
  console.group('CSS Utils Tests');
  
  try {
    // Test vendor prefixes
    const prefixed = CSSUtils.addVendorPrefixes('transform', 'translateX(10px)');
    const hasPrefixes = prefixed.includes('-webkit-') && prefixed.includes('-moz-');// Test fallback classes generation
    const classes = CSSUtils.generateFallbackClasses();
    const isArray = Array.isArray(classes);`);
    
    // Test applying feature classes
    CSSUtils.applyFeatureClasses();
    const hasClasses = document.documentElement.classList.length > 0;} catch (error) {
    console.error('✗ CSS Utils tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for performance monitoring
 */
export const testPerformanceMonitoring = () => {
  console.group('Performance Monitoring Tests');
  
  try {
    const monitor = new PerformanceMonitor();
    
    // Test basic measurement
    monitor.startMeasure('test-operation');
    
    // Simulate some work
    setTimeout(() => {
      const duration = monitor.endMeasure('test-operation');// Test metrics retrieval
      const metrics = monitor.getMetrics();// Test report generation
      const report = monitor.generateReport();monitor.cleanup();}, 10);
    
  } catch (error) {
    console.error('✗ Performance monitoring tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for cross-browser initialization
 */
export const testCrossBrowserInit = () => {
  console.group('Cross-Browser Initialization Tests');
  
  try {
    // Test initialization
    initializeCrossBrowserSupport();// Check if polyfills were applied
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasCSSSupports = window.CSS && window.CSS.supports;
    const hasMatchMedia = 'matchMedia' in window;} catch (error) {
    console.error('✗ Cross-browser initialization: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test animation performance
 */
export const testAnimationPerformance = () => {
  console.group('Animation Performance Tests');
  
  try {
    // Create test element
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: -100px;
      left: -100px;
      width: 50px;
      height: 50px;
      background: red;
      transform: translateZ(0);
    `;
    document.body.appendChild(testElement);
    
    // Test hardware acceleration
    const hasTransform = testElement.style.transform === 'translateZ(0)';// Test animation performance
    let frameCount = 0;
    const startTime = performance.now();
    
    const animateTest = () => {
      frameCount++;
      testElement.style.transform = `translateZ(0) rotate(${frameCount}deg)`;
      
      if (frameCount < 60) {
        requestAnimationFrame(animateTest);
      } else {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const fps = Math.round((frameCount * 1000) / duration);`);
        
        // Cleanup
        document.body.removeChild(testElement);
      }
    };
    
    requestAnimationFrame(animateTest);
    
  } catch (error) {
    console.error('✗ Animation performance tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test memory usage
 */
export const testMemoryUsage = () => {
  console.group('Memory Usage Tests');
  
  if (performance.memory) {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Create some objects to test memory tracking
    const testObjects = [];
    for (let i = 0; i < 1000; i++) {
      testObjects.push({
        id: i,
        data: new Array(100).fill(Math.random())
      });
    }
    
    setTimeout(() => {
      const currentMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = currentMemory - initialMemory;}KB)`);
      
      // Cleanup
      testObjects.length = 0;
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
    }, 100);
  } else {');
  }
  
  console.groupEnd();
};

/**
 * Run all tests
 */
export const runAllOptimizationTests = () => {testFeatureDetection();
  testPerformanceUtils();
  testCSSUtils();
  testPerformanceMonitoring();
  testCrossBrowserInit();
  testAnimationPerformance();
  testMemoryUsage();};

/**
 * Benchmark performance improvements
 */
export const benchmarkPerformance = () => {
  console.group('Performance Benchmarks');
  
  const benchmarks = {
    domQueries: () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        document.querySelector('body');
      }
      return performance.now() - start;
    },
    
    cssAnimations: () => {
      const element = document.createElement('div');
      element.style.cssText = 'position: fixed; top: -100px; transform: translateZ(0);';
      document.body.appendChild(element);
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        element.style.transform = `translateZ(0) translateX(${i}px)`;
      }
      const duration = performance.now() - start;
      
      document.body.removeChild(element);
      return duration;
    },
    
    memoryAllocation: () => {
      const start = performance.now();
      const arrays = [];
      for (let i = 0; i < 1000; i++) {
        arrays.push(new Array(100).fill(i));
      }
      const duration = performance.now() - start;
      arrays.length = 0; // Cleanup
      return duration;
    }
  };
  
  Object.entries(benchmarks).forEach(([name, benchmark]) => {
    try {
      const duration = benchmark();}ms`);
    } catch (error) {
      console.error(`❌ ${name}: ERROR -`, error.message);
    }
  });
  
  console.groupEnd();
};

export default {
  testFeatureDetection,
  testPerformanceUtils,
  testCSSUtils,
  testPerformanceMonitoring,
  testCrossBrowserInit,
  testAnimationPerformance,
  testMemoryUsage,
  runAllOptimizationTests,
  benchmarkPerformance
};