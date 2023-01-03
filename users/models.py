import bcrypt
from django.db import models
# Create your models here.
import re
email_regex = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
names_validators = re.compile("^[a-zA-Z]+$")


class UserManager(models.Manager):
    def validate_and_create_user(form_data):
        errors = []
        if len(form_data['first_name']) < 2 or len(form_data['first_name']) > 32 or len(form_data['last_name']) < 2 or len(form_data['last_name']) < 3:
            errors.append('names must be between 3 and 32 characters.')
        if not email_regex.match(form_data['email']):
            errors.append('please enter a valid email address.')
        if len(form_data['password']) < 2 or len(form_data['password']) > 32 or len(form_data['confirmPassword']) < 2 or len(form_data['confirmPassword']) < 3:
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
        form_data['pw_hash'] = bcrypt.hashpw(
            form_data['password'].encode(), bcrypt.gensalt())
        # print('\n hashed password', form_data['pw_hash'])
        del form_data['confirmPassword']
        del form_data['password']

        newUser = User.objects.create(**form_data)
        return (True, newUser)

# TODO add image to s3 bucket


class User(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    email = models.CharField(max_length=255)
    pw_hash = models.CharField(max_length=500)
    pfp_id = models.CharField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    age = models.PositiveIntegerField()
    balance = models.PositiveIntegerField(default=15000)

    # def __repr__(self):
    #     return f"<User= name={self.first_name},email{self.email}"
