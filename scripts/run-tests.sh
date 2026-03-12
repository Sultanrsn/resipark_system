#!/bin/bash

# Test Runner Script
# Sistem Manajemen Parkir & Akses Kendaraan Perumahan

echo "🧪 Running Test Suite..."
echo "========================"
echo ""

echo "To run tests manually, use:"
echo "  bun test src/__tests__/rules.test.ts"
echo "  bun test src/__tests__/utils.test.ts"
echo "  bun test src/__tests__/api.test.ts"
echo ""

# Check if test files exist
if [ -d "src/__tests__" ]; then
    echo "✅ Test directory exists"
    ls -la src/__tests__/
else
    echo "❌ Test directory not found"
fi

echo ""
echo "Test Documentation: docs/TESTING.md"
