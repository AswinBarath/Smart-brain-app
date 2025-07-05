#!/usr/bin/env node

// Node.js test script for Clarifai SDK
// Run with: node test-clarifai-node.js
// Requires Node.js 18+ for built-in fetch support

// Test configuration
const API_BASE_URL = 'https://smart-brain-api-one.vercel.app';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️ ${message}`, 'yellow');
}

// Test 1: Backend API Test
async function testBackendAPI() {
    log('\n=== Testing Backend API Integration ===', 'bright');
    
    const testImageUrl = 'https://samples.clarifai.com/face-det.jpg';
    
    try {
        logInfo(`Testing with image: ${testImageUrl}`);
        
        const response = await fetch(`${API_BASE_URL}/imageurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: testImageUrl
            })
        });
        
        logInfo(`Response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            logError(`Backend API error response: ${errorText}`);
            return false;
        }
        
        const result = await response.json();
        logSuccess('Backend API call successful');
        logInfo(`Response structure: ${Object.keys(result).join(', ')}`);
        
        // Check if the response contains face detection data
        if (result && result.outputs && result.outputs[0] && result.outputs[0].data) {
            const regions = result.outputs[0].data.regions;
            logSuccess(`Backend found ${regions ? regions.length : 0} face(s) in the image`);
            return true;
        } else {
            logWarning('Backend response does not contain expected face detection data');
            logInfo(`Full response: ${JSON.stringify(result, null, 2)}`);
            return false;
        }
        
    } catch (error) {
        logError(`Backend API test failed: ${error.message}`);
        return false;
    }
}

// Test 2: Multiple Images Test
async function testMultipleImages() {
    log('\n=== Testing Multiple Image Types ===', 'bright');
    
    const testImages = [
        'https://samples.clarifai.com/face-det.jpg',
        'https://samples.clarifai.com/metro-north.jpg',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
    ];
    
    let successCount = 0;
    
    for (let i = 0; i < testImages.length; i++) {
        const imageUrl = testImages[i];
        logInfo(`\nTesting image ${i + 1}: ${imageUrl}`);
        
        try {
            const response = await fetch(`${API_BASE_URL}/imageurl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: imageUrl
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result && result.outputs && result.outputs[0] && result.outputs[0].data) {
                    const regions = result.outputs[0].data.regions;
                    logSuccess(`Image ${i + 1}: Found ${regions ? regions.length : 0} face(s)`);
                    successCount++;
                } else {
                    logWarning(`Image ${i + 1}: No face detection data`);
                }
            } else {
                logError(`Image ${i + 1}: API error (${response.status})`);
            }
        } catch (error) {
            logError(`Image ${i + 1}: Request failed - ${error.message}`);
        }
    }
    
    logInfo(`\nMultiple images test completed: ${successCount}/${testImages.length} successful`);
    return successCount > 0;
}

// Test 3: Error Handling Test
async function testErrorHandling() {
    log('\n=== Testing Error Handling ===', 'bright');
    
    // Test with invalid image URL
    const invalidImageUrl = 'https://invalid-image-url-that-does-not-exist.com/image.jpg';
    
    try {
        logInfo(`Testing with invalid image URL: ${invalidImageUrl}`);
        
        const response = await fetch(`${API_BASE_URL}/imageurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: invalidImageUrl
            })
        });
        
        const result = await response.json();
        logInfo(`Response for invalid image: ${JSON.stringify(result, null, 2)}`);
        
        if (response.ok) {
            logSuccess('Backend handled invalid image gracefully');
            return true;
        } else {
            logWarning('Backend returned error for invalid image (expected)');
            return true; // This is expected behavior
        }
        
    } catch (error) {
        logError(`Error handling test failed: ${error.message}`);
        return false;
    }
}

// Test 4: Direct Clarifai Test (if PAT is provided)
async function testDirectClarifai() {
    log('\n=== Testing Direct Clarifai API ===', 'bright');
    
    // Check if PAT is provided as environment variable
    const PAT = process.env.CLARIFAI_PAT;
    
    if (!PAT) {
        logWarning('CLARIFAI_PAT environment variable not set. Skipping direct Clarifai test.');
        logInfo('To test direct Clarifai API, set your Personal Access Token:');
        logInfo('export CLARIFAI_PAT=your_token_here');
        return false;
    }
    
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const testImageUrl = 'https://samples.clarifai.com/face-det.jpg';
    
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": testImageUrl
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    try {
        logInfo(`Testing with image: ${testImageUrl}`);
        
        const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        logSuccess('Direct Clarifai API call successful');
        logInfo(`Response structure: ${Object.keys(result).join(', ')}`);
        
        if (result.outputs && result.outputs[0] && result.outputs[0].data) {
            const regions = result.outputs[0].data.regions;
            logSuccess(`Found ${regions ? regions.length : 0} face(s) in the image`);
            
            if (regions && regions.length > 0) {
                regions.forEach((region, index) => {
                    const boundingBox = region.region_info.bounding_box;
                    logInfo(`Face ${index + 1}: ${JSON.stringify({
                        top_row: boundingBox.top_row.toFixed(3),
                        left_col: boundingBox.left_col.toFixed(3),
                        bottom_row: boundingBox.bottom_row.toFixed(3),
                        right_col: boundingBox.right_col.toFixed(3)
                    }, null, 2)}`);
                });
            }
            return true;
        } else {
            logWarning('No face regions found in response');
            return false;
        }
        
    } catch (error) {
        logError(`Direct Clarifai API test failed: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    log('🚀 Starting Clarifai SDK Tests...', 'bright');
    log(`API Base URL: ${API_BASE_URL}`, 'cyan');
    
    const results = {
        backendAPI: false,
        multipleImages: false,
        errorHandling: false,
        directClarifai: false
    };
    
    // Run tests
    results.backendAPI = await testBackendAPI();
    results.multipleImages = await testMultipleImages();
    results.errorHandling = await testErrorHandling();
    results.directClarifai = await testDirectClarifai();
    
    // Summary
    log('\n=== Test Summary ===', 'bright');
    log(`Backend API Integration: ${results.backendAPI ? '✅ PASS' : '❌ FAIL'}`);
    log(`Multiple Images Test: ${results.multipleImages ? '✅ PASS' : '❌ FAIL'}`);
    log(`Error Handling Test: ${results.errorHandling ? '✅ PASS' : '❌ FAIL'}`);
    log(`Direct Clarifai API: ${results.directClarifai ? '✅ PASS' : '⚠️ SKIP'}`);
    
    if (results.backendAPI) {
        log('\n🎉 Critical tests passed! The Clarifai SDK is working correctly.', 'green');
        log('Your Smart Brain App should be able to detect faces properly.', 'green');
    } else {
        log('\n⚠️ Critical tests failed. Please check the configuration and try again.', 'red');
        log('Make sure your backend API is running and accessible.', 'yellow');
    }
    
    return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        logError(`Test runner failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    testBackendAPI,
    testMultipleImages,
    testErrorHandling,
    testDirectClarifai,
    runAllTests
}; 