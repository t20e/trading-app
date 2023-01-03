# to serialize from python obj to JSON
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # for all fields
        fields = '__all__'
        # or
        # fields = ['id', 'first_name', 'last_name', 'email', 'pfp_id',
        #           'pw_hash', 'created_at', 'updated_at', 'age', 'balance']
