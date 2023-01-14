import bcrypt
from django.db import models
import re
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

email_regex = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
names_validators = re.compile("^[a-zA-Z]+$")


class UserManager(models.Manager):

    def validate_and_create_user(form_data):
        errors = []
        if len(form_data['first_name']) < 2 or len(
                form_data['first_name']) > 32 or len(
                    form_data['last_name']) < 2 or len(
                        form_data['last_name']) < 3:
            errors.append('names must be between 3 and 32 characters.')
        if not email_regex.match(form_data['email']):
            errors.append('please enter a valid email address.')
        if len(form_data['password']) < 2 or len(
                form_data['password']) > 32 or len(
                    form_data['confirmPassword']) < 2 or len(
                        form_data['confirmPassword']) < 3:
            errors.append('passwords must be at least 8 characters long')
        if form_data['password'] != form_data['confirmPassword']:
            errors.append('passwords dont match')
        if form_data['age'] == '':
            errors.append('please enter a valid age')
        elif int(form_data['age']) < 18 or int(form_data['age']) > 150:
            errors.append('user age is not between 18 and 150')
        # check for uniqueness of a field ifs its already being used
        # one way to
        checkEmailInDb = User.objects.filter(
            email=form_data['email'])  # this returns a list
        if len(checkEmailInDb) > 0:
            errors.append('email already in use')
        if len(errors) > 0:
            return (False, errors)
        # I decoded it from byte to string when saving to db so that when comparing with login it wont throw invalid salt
        form_data['pw_hash'] = bcrypt.hashpw(
            form_data['password'].encode('utf-8'),
            bcrypt.gensalt()).decode('utf-8')
        del form_data['confirmPassword']
        del form_data['password']
        newUser = User.objects.create(**form_data)
        return (True, newUser)

    def loginUser(self, data):
        if data['email'] is None or data['password'] is None or len(
                data['password']) == 0 or len(data['email']) == 0:
            return (False, 'Please provide email and password')
        checkEmailDb = User.objects.filter(email=data['email']).first()
        if checkEmailDb is None:
            return (False, 'User not found!')
        print('\n', checkEmailDb.pw_hash.encode('utf-8'), '\n')
        print(
            '\n',
            bcrypt.checkpw(data['password'].encode('utf-8'),
                           checkEmailDb.pw_hash.encode('utf-8')), '\n')
        if not bcrypt.checkpw(data['password'].encode(),
                              checkEmailDb.pw_hash.encode()):
            return (False, 'Invalid credentials')
        return (True, checkEmailDb)


class User(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    email = models.CharField(max_length=255)
    pw_hash = models.CharField(max_length=500)
    pfp_id = models.CharField(
        default=False,
        max_length=500,
    )
    curr_currency = models.CharField(max_length=12, default='EUR/USD')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    age = models.PositiveIntegerField()
    balance = models.PositiveIntegerField(default=15000)
    test =models.PositiveIntegerField(default=15000)
    objects = UserManager()

    # override default method so we can see more info from the user in the terminal
    # def __repr__(self):
    #     return f"<User= name={self.first_name},email{self.email}"
