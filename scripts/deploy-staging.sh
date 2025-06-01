#!/bin/bash

# DROMIC-IS Staging Deployment Script for AWS
# This script helps the cloud team deploy the staging environment

set -e

# Configuration
ENVIRONMENT="staging"
AWS_REGION="${AWS_REGION:-ap-southeast-1}"
ECR_REPOSITORY="${ECR_REPOSITORY:-dromic-staging}"
ECS_CLUSTER="${ECS_CLUSTER:-dromic-staging}"
ECS_SERVICE="${ECS_SERVICE:-dromic-staging-service}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON output will not be formatted."
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi
    
    print_success "Prerequisites check passed!"
}

# Function to build and push Docker image
build_and_push() {
    print_status "Building Docker image..."
    
    # Get AWS account ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
    
    # Login to ECR
    print_status "Logging in to ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
    
    # Build image
    print_status "Building Docker image for staging..."
    docker build -f Dockerfile.staging -t $ECR_REPOSITORY:latest .
    
    # Tag for ECR
    docker tag $ECR_REPOSITORY:latest $ECR_URI:latest
    docker tag $ECR_REPOSITORY:latest $ECR_URI:$(date +%Y%m%d-%H%M%S)
    
    # Push to ECR
    print_status "Pushing image to ECR..."
    docker push $ECR_URI:latest
    docker push $ECR_URI:$(date +%Y%m%d-%H%M%S)
    
    print_success "Image pushed successfully!"
    echo "ECR URI: $ECR_URI:latest"
}

# Function to deploy to ECS
deploy_ecs() {
    print_status "Deploying to ECS..."
    
    # Update ECS service to force new deployment
    aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $ECS_SERVICE \
        --force-new-deployment \
        --region $AWS_REGION
    
    print_status "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster $ECS_CLUSTER \
        --services $ECS_SERVICE \
        --region $AWS_REGION
    
    print_success "ECS deployment completed!"
}

# Function to run health check
health_check() {
    print_status "Running health check..."
    
    # Wait a bit for the service to start
    sleep 30
    
    # Try health check multiple times
    max_attempts=10
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"
        
        if curl -f -s https://staging.dromic-is.dswd.gov.ph/api/health > /dev/null; then
            print_success "Health check passed!"
            
            # Show health status if jq is available
            if command -v jq &> /dev/null; then
                curl -s https://staging.dromic-is.dswd.gov.ph/api/health | jq '.'
            fi
            return 0
        else
            print_warning "Health check failed, retrying in 30 seconds..."
            sleep 30
            attempt=$((attempt + 1))
        fi
    done
    
    print_error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo "==================="
    echo "Environment: $ENVIRONMENT"
    echo "AWS Region: $AWS_REGION"
    echo "ECS Cluster: $ECS_CLUSTER"
    echo "ECS Service: $ECS_SERVICE"
    echo "ECR Repository: $ECR_REPOSITORY"
    echo ""
    
    # Show ECS service status
    if aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION &> /dev/null; then
        print_status "ECS Service Status:"
        aws ecs describe-services \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE \
            --region $AWS_REGION \
            --query 'services[0].{Status:status,RunningCount:runningCount,DesiredCount:desiredCount}' \
            --output table
    fi
}

# Main deployment function
deploy() {
    print_status "Starting DROMIC-IS Staging Deployment..."
    echo "========================================"
    
    check_prerequisites
    build_and_push
    deploy_ecs
    health_check
    show_status
    
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Staging URL: https://staging.dromic-is.dswd.gov.ph"
    echo "📊 Health Check: https://staging.dromic-is.dswd.gov.ph/api/health"
}

# Function to show help
show_help() {
    cat << EOF
DROMIC-IS Staging Deployment Script

Usage: $0 [COMMAND]

Commands:
    deploy      Deploy the application to AWS (default)
    build       Build and push Docker image only
    health      Run health check only
    status      Show current deployment status
    help        Show this help message

Environment Variables:
    AWS_REGION      AWS region (default: ap-southeast-1)
    ECR_REPOSITORY  ECR repository name (default: dromic-staging)
    ECS_CLUSTER     ECS cluster name (default: dromic-staging)
    ECS_SERVICE     ECS service name (default: dromic-staging-service)

Examples:
    $0 deploy               # Full deployment
    $0 build                # Build and push image only
    $0 health               # Check application health
    AWS_REGION=us-west-2 $0 deploy  # Deploy to different region
EOF
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    build)
        check_prerequisites
        build_and_push
        ;;
    health)
        health_check
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
