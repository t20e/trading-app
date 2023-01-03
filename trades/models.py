from django.db import models
from users.models import User
# Create your models here.


class TradeManager(models.Manager):
    pass


class Trade(models.Model):
    # related_name gets the data from each other model
        # one to many
    user_id = models.ForeignKey(User, related_name="trades", on_delete=models.CASCADE)
    currency_pair = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    predictingUp = models.BooleanField()
    price_at_trade = models.PositiveIntegerField()
    expires_at = models.DateTimeField(auto_now_add=True)
    profit = models.PositiveIntegerField()
    test = models.PositiveIntegerField()
    

    # many to many example
    # people_all_trades = models.ManyToManyField(User, related_name="people_seen_others_trades")
        # and we can access this relationship with 
            # users.people_seen_others_trades.all()

# we can add other tables here
