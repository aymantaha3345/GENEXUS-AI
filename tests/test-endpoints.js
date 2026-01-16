const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.POLLINATIONS_API_KEY || '';

console.log('🧪 Testing GENEXUS-AI API endpoints...');
console.log(`🌐 Base URL: ${BASE_URL}`);

async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
    return false;
  }
}

async function testImageGeneration() {
  console.log('\n🎨 Testing Image Generation...');
  try {
    // Test GET request (browser friendly)
    console.log('Testing GET image generation...');
    const getImageUrl = `${BASE_URL}/api/images/generate?prompt=A beautiful sunset over mountains&model=flux&width=512&height=512`;
    console.log('GET URL:', getImageUrl);
    
    // Test POST request
    console.log('\nTesting POST image generation...');
    const postData = {
      prompt: 'A majestic lion in the savannah',
      model: 'turbo',
      width: 1024,
      height: 1024
    };
    
    const response = await axios.post(`${BASE_URL}/api/images/generate`, postData);
    console.log('✅ POST Image Generation:', response.data);
    
    // Save the generated image if available
    if (response.data.data.imageUrl) {
      console.log('📸 Generated image URL:', response.data.data.imageUrl);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Image Generation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testVideoGeneration() {
  console.log('\n🎬 Testing Video Generation...');
  try {
    const postData = {
      prompt: 'A futuristic city with flying cars',
      model: 'seedance',
      duration: 5
    };
    
    const response = await axios.post(`${BASE_URL}/api/videos/generate`, postData);
    console.log('✅ Video Generation:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Video Generation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testChatGeneration() {
  console.log('\n💬 Testing Chat Generation...');
  try {
    // Test GET request (browser friendly)
    console.log('Testing GET chat...');
    const getChatUrl = `${BASE_URL}/api/chat/chat?prompt=Hello! How are you today?&model=openai-fast`;
    console.log('GET URL:', getChatUrl);
    
    // Test POST request
    console.log('\nTesting POST chat...');
    const postData = {
      prompt: 'Explain quantum computing in simple terms',
      model: 'gemini-fast',
      temperature: 0.7,
      max_tokens: 500
    };
    
    const response = await axios.post(`${BASE_URL}/api/chat/chat`, postData);
    console.log('✅ Chat Generation:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Chat Generation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testModelLists() {
  console.log('\n📋 Testing Model Lists...');
  try {
    const imageModels = await axios.get(`${BASE_URL}/api/images/models`);
    console.log('✅ Image Models:', imageModels.data.data.length, 'models available');
    
    const videoModels = await axios.get(`${BASE_URL}/api/videos/models`);
    console.log('✅ Video Models:', videoModels.data.data.length, 'models available');
    
    const chatModels = await axios.get(`${BASE_URL}/api/chat/models`);
    console.log('✅ Chat Models:', chatModels.data.data.length, 'models available');
    
    return true;
  } catch (error) {
    console.error('❌ Model Lists failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  let allPassed = true;
  
  console.log('='.repeat(50));
  console.log('🚀 STARTING GENEXUS-AI API TESTS');
  console.log('='.repeat(50));
  
  // Run tests sequentially
  const tests = [
    testHealthCheck,
    testModelLists,
    testImageGeneration,
    testVideoGeneration,
    testChatGeneration
  ];
  
  for (const test of tests) {
    const result = await test();
    allPassed = allPassed && result;
    console.log('-'.repeat(50));
  }
  
  console.log('='.repeat(50));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } else {
    console.log('❌ SOME TESTS FAILED. Please check the errors above.');
  }
  console.log('='.repeat(50));
  
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Unexpected error during testing:', error);
  process.exit(1);
});