from django.db import models
from users.models import User
# Create your models here.


class TradeManager(models.Manager):
    def create_trade(self, data):
        user = User.objects.get(id=data['user_id'])
        data['user_id'] = user
        if user.balance - data['investAmount'] < 0:
            return (False, 'you dont have enough money')
        if data['investAmount'] > 15000:
            return (False, 'trades are limited to $15,000')
        user.balance -= data['investAmount']
        user.save()
        print(user.trades)
        print(data)
        newTrade = Trade.objects.create(**data)
        return (True, newTrade)


class Trade(models.Model):
    # related_name gets the data from each other model
    # one to many
    user_id = models.ForeignKey(User,
                                related_name="trades",
                                on_delete=models.CASCADE)
    currency_pair = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    predictingUp = models.BooleanField()
    price_at_trade = models.FloatField()
    expires_at = models.DateTimeField(auto_now_add=True)
    profit = models.FloatField(default=0)
    investAmount = models.PositiveIntegerField()
    isClosed = models.BooleanField(default=False)
    objects = TradeManager()

    # many to many example
    # people_all_trades = models.ManyToManyField(User, related_name="people_seen_others_trades")
    # and we can access this relationship with
    # users.people_seen_others_trades.all()


# we can add other tables here
