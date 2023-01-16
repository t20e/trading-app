# to serialize from python obj to JSON
from rest_framework import serializers
from .models import Trade


class TradeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trade
        # for all fields
        fields = '__all__'
        # or to specify fields this one excludes password hash
        # fields = [
        #     'user_id', 'currency_pair', 'predictingUp', 'last_name', 'email', 'pfp_id',
        #     'created_at', 'updated_at', 'age', 'balance'
        # ]
