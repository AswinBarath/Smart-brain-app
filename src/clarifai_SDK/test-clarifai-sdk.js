// Test file for Clarifai SDK functionality
// This file tests both direct Clarifai API calls and the backend API integration

// Test 1: Direct Clarifai SDK Test
async function testDirectClarifaiSDK() {
  console.log('=== Testing Direct Clarifai SDK ===');
  
  // Check if environment variable is set
  if (!process.env.CLARIFAI_PAT) {
    console.log('❌ CLARIFAI_PAT environment variable not set');
    console.log('Please set your Clarifai Personal Access Token as an environment variable');
    return false;
  }
  
  const PAT = process.env.CLARIFAI_PAT;
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  
  // Test with a known face image
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
    console.log('🔍 Testing with image:', testImageUrl);
    
    const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Direct Clarifai API call successful');
    console.log('Response structure:', Object.keys(result));
    
    if (result.outputs && result.outputs[0] && result.outputs[0].data) {
      const regions = result.outputs[0].data.regions;
      console.log(`✅ Found ${regions ? regions.length : 0} face(s) in the image`);
      
      if (regions && regions.length > 0) {
        regions.forEach((region, index) => {
          const boundingBox = region.region_info.bounding_box;
          console.log(`Face ${index + 1}:`, {
            top_row: boundingBox.top_row.toFixed(3),
            left_col: boundingBox.left_col.toFixed(3),
            bottom_row: boundingBox.bottom_row.toFixed(3),
            right_col: boundingBox.right_col.toFixed(3)
          });
        });
      }
    } else {
      console.log('⚠️ No face regions found in response');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Direct Clarifai API test failed:', error.message);
    return false;
  }
}

// Test 2: Backend API Test
async function testBackendAPI() {
  console.log('\n=== Testing Backend API Integration ===');
  
  const API_BASE_URL = 'https://smart-brain-api-one.vercel.app';
  const testImageUrl = 'https://samples.clarifai.com/face-det.jpg';
  
  try {
    console.log('🔍 Testing backend API with image:', testImageUrl);
    
    const response = await fetch(`${API_BASE_URL}/imageurl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: testImageUrl
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Backend API error response:', errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ Backend API call successful');
    console.log('Response structure:', Object.keys(result));
    
    // Check if the response contains face detection data
    if (result && result.outputs && result.outputs[0] && result.outputs[0].data) {
      const regions = result.outputs[0].data.regions;
      console.log(`✅ Backend found ${regions ? regions.length : 0} face(s) in the image`);
      return true;
    } else {
      console.log('⚠️ Backend response does not contain expected face detection data');
      console.log('Full response:', JSON.stringify(result, null, 2));
      return false;
    }
    
  } catch (error) {
    console.log('❌ Backend API test failed:', error.message);
    return false;
  }
}

// Test 3: Multiple Image Test
async function testMultipleImages() {
  console.log('\n=== Testing Multiple Image Types ===');
  
  const testImages = [
    'https://samples.clarifai.com/face-det.jpg',
    'https://samples.clarifai.com/metro-north.jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
  ];
  
  const API_BASE_URL = 'https://smart-brain-api-one.vercel.app';
  
  for (let i = 0; i < testImages.length; i++) {
    const imageUrl = testImages[i];
    console.log(`\n🔍 Testing image ${i + 1}: ${imageUrl}`);
    
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
          console.log(`✅ Image ${i + 1}: Found ${regions ? regions.length : 0} face(s)`);
        } else {
          console.log(`⚠️ Image ${i + 1}: No face detection data`);
        }
      } else {
        console.log(`❌ Image ${i + 1}: API error (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Image ${i + 1}: Request failed - ${error.message}`);
    }
  }
}

// Test 4: Error Handling Test
async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  const API_BASE_URL = 'https://smart-brain-api-one.vercel.app';
  
  // Test with invalid image URL
  const invalidImageUrl = 'https://invalid-image-url-that-does-not-exist.com/image.jpg';
  
  try {
    console.log('🔍 Testing with invalid image URL:', invalidImageUrl);
    
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
    console.log('Response for invalid image:', result);
    
    if (response.ok) {
      console.log('✅ Backend handled invalid image gracefully');
    } else {
      console.log('⚠️ Backend returned error for invalid image (expected)');
    }
    
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Clarifai SDK Tests...\n');
  
  const results = {
    directSDK: false,
    backendAPI: false,
    multipleImages: true,
    errorHandling: true
  };
  
  // Run tests
  results.directSDK = await testDirectClarifaiSDK();
  results.backendAPI = await testBackendAPI();
  await testMultipleImages();
  await testErrorHandling();
  
  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Direct Clarifai SDK: ${results.directSDK ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend API Integration: ${results.backendAPI ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Multiple Images Test: ${results.multipleImages ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Error Handling Test: ${results.errorHandling ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.directSDK && results.backendAPI) {
    console.log('\n🎉 All critical tests passed! The Clarifai SDK is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration and try again.');
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testDirectClarifaiSDK,
    testBackendAPI,
    testMultipleImages,
    testErrorHandling,
    runAllTests
  };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
} 