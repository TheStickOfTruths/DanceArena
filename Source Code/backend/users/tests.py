from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
import json

User = get_user_model()

class CurrentUserTests(APITestCase):

    def setUp(self):
        self.user_data = {
            "username": "testplesac",
            "email": "test@ples.com",
            "password": "testpassword123",
            "first_name": "Ivan",
            "last_name": "Ivić",
            "role": "ORGANIZER",
            "contact": "0993838383"
        }
        self.user = User.objects.create_user(**self.user_data)
        self.url = reverse('current_user') 

    def test_current_user_authenticated(self):
        print(f"\nTesting testCurrentUserAuthenticated with User: {self.user.username}")
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        if response.status_code == 200 and response.json().get('authenticated'):
            print(f"Test passed: Successfully retrieved data for user: {self.user.username}")
            print(f""" 
                "username": {self.user.username},
                "email": {self.user.email},
                "first_name": {self.user.first_name},
                "last_name": {self.user.last_name},
                "role": {self.user.role},
                "contact": {self.user.contact}
            """)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['authenticated'])

    def test_current_user_not_authenticated(self):
        print("\nTesting testCurrentUserNotAuthenticated (Guest access)")
        
        response = self.client.get(self.url)
        
        if response.status_code == 200 and not response.json().get('authenticated'):
            print("Test passed: Successfully identified unauthenticated user")
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.json()['authenticated'])


class UserUpdateTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="plesac123",
            password="password123",
            role="ANONYMOUS"
        )
        self.url = reverse('user_info') 

    def test_update_club_manager_success(self):
        print(f"\nTesting test Update Club Manager Success with User ID: {self.user.id}")
        
        self.client.force_authenticate(user=self.user)
        
        payload = {
            "role": "CLUB_MANAGER",
            "name": "Marko",
            "surname": "Marković",
            "club_name": "Plesni Studio X",
            "club_location": "Split"
        }
        print(f"Sent data: {payload}")

        response = self.client.put(
            self.url, 
            data=json.dumps(payload), 
            content_type='application/json'
        )

        if response.status_code == 200:
            print(f"Test passed: Successfully updated user to CLUB_MANAGER with ID: {self.user.id}")
            self.user.refresh_from_db()
            print(f""" 
                "username": {self.user.username},
                "email": {self.user.email},
                "first_name": {self.user.first_name},
                "last_name": {self.user.last_name},
                "role": {self.user.role},
                "club_name": {self.user.club_name},
                "club_location": {self.user.club_location}
            """)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.club_name, "Plesni Studio X")

    def test_update_invalid_role(self):
        print("\nTesting test Update Invalid Role (Negative test)")
        
        self.client.force_authenticate(user=self.user)
        
        payload = {
            "role": "NEPOSTOJECA_ULOGA",
            "name": "Greška"
        }
        print(f"Sent data: {payload}")
        
        response = self.client.put(
            self.url, 
            data=json.dumps(payload), 
            content_type='application/json'
        )

        if response.status_code == 400:
            print("Test passed: System correctly rejected invalid role")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)