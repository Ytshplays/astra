# Firebase CLI Commands Reference

## Project Management
firebase projects:list                     # List all Firebase projects
firebase use nexus-hub-v2gfz              # Switch to specific project
firebase use --add                        # Add project alias

## Firestore Commands
firebase deploy --only firestore:rules    # Deploy security rules
firebase deploy --only firestore:indexes  # Deploy database indexes
firebase firestore:delete --all-collections  # Delete all data (careful!)

## Authentication Commands
# Note: Auth setup is done via Firebase Console
# Visit: https://console.firebase.google.com/project/nexus-hub-v2gfz/authentication/providers

## Deployment Commands
firebase deploy                          # Deploy everything
firebase deploy --only hosting          # Deploy hosting only
firebase deploy --only functions        # Deploy functions only

## Local Development
firebase emulators:start                 # Start local emulators
firebase emulators:start --only firestore  # Start only Firestore emulator

## Monitoring & Logs
firebase projects:list
firebase apps:list
firebase use --list

## Database Management
firebase firestore:delete [path]        # Delete specific document
firebase firestore:export [bucket]      # Export data
firebase firestore:import [bucket]      # Import data

## Security Testing
firebase deploy --only firestore:rules
firebase firestore:rules:test
