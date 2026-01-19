from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Competition, AgeCategory, StyleCategory, GroupSizeCategory, \
                    AgeChoices, StyleChoices, GroupSizeChoices, StatusChoices
from users.models import Role
import json

User = get_user_model()

class MyCompetitionsTests(APITestCase):

    def setUp(self):
        self.organizer = User.objects.create_user(
            username="organizator1",
            password="password123",
            role=Role.ORGANIZER,
            first_name="Luka",
            last_name="Test",
            contact="09999999"
        )

        self.judge = User.objects.create_user(
            username="sudac1",
            password="password123",
            role=Role.JUDGE,
            first_name="Roko",
            last_name="Test",
        )

        self.manager = User.objects.create_user(
            username="voditelj1",
            password="password123",
            role=Role.CLUB_MANAGER,
            first_name="Maro",
            last_name="Test",
            club_name="Dance Croatia",
            club_location="Zagreb"
        )

        AgeCategory.objects.bulk_create([
            AgeCategory(name=AgeChoices.DJECA),
            AgeCategory(name=AgeChoices.JUNIORI),
            AgeCategory(name=AgeChoices.SENIORI)
        ])
        self.all_ages = AgeCategory.objects.all()

        StyleCategory.objects.bulk_create([
            StyleCategory(name=StyleChoices.BALET),
            StyleCategory(name=StyleChoices.BREAK),
            StyleCategory(name=StyleChoices.HIPHOP),
            StyleCategory(name=StyleChoices.JAZZ),
            StyleCategory(name=StyleChoices.STEP)
        ])
        self.all_styles = StyleCategory.objects.all()

        GroupSizeCategory.objects.bulk_create([
            GroupSizeCategory(name=GroupSizeChoices.SOLO),
            GroupSizeCategory(name=GroupSizeChoices.DUO),
            GroupSizeCategory(name=GroupSizeChoices.MALA_GRUPA),
            GroupSizeCategory(name=GroupSizeChoices.FORMACIJA)
        ])
        self.all_sizes = GroupSizeCategory.objects.all()
        
        self.comp1 = Competition.objects.create(
            name="Dalmacija Dance Cup",
            organizer=self.organizer, 
            date="2026-05-15",
            location="Split",
            registration_fee=20,
            status=StatusChoices.DRAFT
        )
        self.comp1.age_categories.set(self.all_ages)
        self.comp1.style_categories.set(self.all_styles)
        self.comp1.group_size_categories.set(self.all_sizes)

        self.comp2 = Competition.objects.create(
            name="Zagreb Open",
            organizer=self.organizer,
            date="2026-06-20",
            location="Zagreb",
            registration_fee=25,
            status=StatusChoices.ACTIVE
        )
        self.comp2.age_categories.set(self.all_ages)
        self.comp2.style_categories.set(self.all_styles)
        self.comp2.group_size_categories.set(self.all_sizes)

        self.url_mycompetitions = reverse('my_competitions')
        self.url_new = reverse('competition_create')
        self.url_edit = reverse('competition_edit', kwargs={'id': self.comp1.id})
        self.url_edit_active = reverse('competition_edit', kwargs={'id': self.comp2.id})
        self.url_publish = reverse('competition_publish', kwargs={'id': self.comp1.id})
        self.url_publish_active = reverse('competition_publish', kwargs={'id': self.comp2.id})

    def test_my_competitions_success(self):
        print(f"\nTesting test MyCompetitions Success for User: {self.organizer.username}")
        
        self.client.force_authenticate(user=self.organizer)
        response = self.client.get(self.url_mycompetitions)
        
        if response.status_code == 200 and isinstance(response.json(), list):
            print(f"Test passed: Successfully retrieved {len(response.json())} competition(s) for organizer: {self.organizer.username}")
            print(f"Competition(s) found: {response.json()[0]['name']}...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(response.json()[0]['name'], "Dalmacija Dance Cup")

    def test_my_competitions_empty(self):
        print(f"\nTesting test MyCompetitions Empty for User: {self.judge.username}")
        
        self.client.force_authenticate(user=self.judge)
        response = self.client.get(self.url_mycompetitions)
        
        if response.status_code == 200 and 'success' in response.json():
            print(f"Test passed: Correctly identified that user '{self.judge.username}' has no competitions.")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['success'], "Nema natjecanja.")


    def test_new_competition_success(self):
        print(f"\nTesting test New Competition Success for User: {self.organizer.username}")
    
        self.client.force_authenticate(user=self.organizer)
        
        payload = {
            "name": "Novi Plesni Kup",
            "date": "2026-07-20",
            "location": "Zadar",
            "description": "Opis natjecanja",
            "registration_fee": 15,
            "age_categories": ["DJECA", "JUNIORI"], 
            "style_categories": ["HIPHOP", "JAZZ"],
            "group_size_categories": ["SOLO", "DUO"]
        }
        
        response = self.client.post(
            self.url_new, 
            data=json.dumps(payload), 
            content_type='application/json'
        )
        
        if response.status_code == 201:
            res_data = response.json()
            print(f"Test passed: Successfully created competition with ID: {res_data.get('id')}")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['message'], 'Natjecanje kreirano!')
        
        from .models import Competition
        self.assertTrue(Competition.objects.filter(name="Novi Plesni Kup").exists())

    def test_new_competition_forbidden_role(self):
        print(f"\nTesting test New Competition incomplete for User: {self.organizer.username}")
        
        self.client.force_authenticate(user=self.judge)
        
        payload = {"name": "Zabranjeno natjecanje"}
        
        response = self.client.post(
            self.url_new, 
            data=json.dumps(payload), 
            content_type='application/json'
        )
        
        if response.status_code == 403:
            print(f"Test passed: Correctly denied creation to user with id: {self.organizer.id}")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_edit_competition_success(self):
        print(f"\nTesting test Edit Competition Success for ID: {self.comp1.id}")
        
        self.client.force_authenticate(user=self.organizer)
        
        payload = {
            "name": "Izmijenjeno Ime Natjecanja",
            "location": "Zadar - Nova lokacija",
            "age_categories": ["DJECA", "SENIORI"]
        }
        
        response = self.client.put(
            self.url_edit, 
            data=json.dumps(payload), 
            content_type='application/json'
        )

        if response.status_code == 201:
            print(f"Test passed: Successfully edited competition with ID: {self.comp1.id}")
            self.comp1.refresh_from_db()
            print(f"Verified: New name is '{self.comp1.name}'")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.comp1.name, "Izmijenjeno Ime Natjecanja")

    def test_edit_competition_forbidden_not_owner(self):
        print(f"\nTesting test Edit Competition Forbidden Not Owner (Unauthorized user)")
        
        self.client.force_authenticate(user=self.manager)
        
        payload = {"name": "Hakerski napad"}
        
        response = self.client.put(
            self.url_edit, 
            data=json.dumps(payload), 
            content_type='application/json'
        )

        if response.status_code == 403:
            print("Test passed: System correctly blocked non-owner from editing.")

        self.assertEqual(response.status_code, 403)

    def test_edit_competition_not_draft(self):
        print(f"\nTesting test Edit Competition Not Draft (Status check)")
        
        self.client.force_authenticate(user=self.organizer)
        
        payload = {"name": "Promjena na objavljenom"}
        
        response = self.client.put(
            self.url_edit_active, 
            data=json.dumps(payload), 
            content_type='application/json'
        )

        if response.status_code == 401:
            print("Test passed: System correctly blocked editing of a non-draft competition.")

        self.assertEqual(response.status_code, 401)


    def test_publish_competition_success(self):
        print(f"\nTesting test Publish Competition Success for ID: {self.comp1.id}")
        
        self.client.force_authenticate(user=self.organizer)
        
        response = self.client.put(self.url_publish)

        if response.status_code == 200:
            print(f"Test passed: Competition '{self.comp1.name}' is now PUBLISHED.")
            self.comp1.refresh_from_db()
            print(f"Verified status in database: {self.comp1.status}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.comp1.status, "PUBLISHED")

    def test_publish_competition_not_owner(self):
        print(f"\nTesting test Publish Competition Not Owner (Unauthorized attempt)")
        
        self.client.force_authenticate(user=self.judge)
        
        response = self.client.put(self.url_publish)

        if response.status_code == 403:
            print("Test passed: Access denied for non-owner.")

        self.assertEqual(response.status_code, 403)

    def test_publish_already_published(self):
        print(f"\nTesting test Publish Non Draft (Double publish check)")
        
        self.client.force_authenticate(user=self.organizer)
        
        response = self.client.put(self.url_publish_active)

        if response.status_code == 401:
            print("Test passed: System correctly blocked re-publishing an already active competition.")

        self.assertEqual(response.status_code, 401)