# Generated by Django 4.1.5 on 2023-01-15 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trades', '0003_trade_isclosed_alter_trade_profit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='profit',
            field=models.FloatField(default=0),
        ),
    ]
