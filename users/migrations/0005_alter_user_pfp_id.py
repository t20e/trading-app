# Generated by Django 4.1.5 on 2023-01-18 04:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_pfp_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pfp_id',
            field=models.CharField(default='None', max_length=500),
        ),
    ]
