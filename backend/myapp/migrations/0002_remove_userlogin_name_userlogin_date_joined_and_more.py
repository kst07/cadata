# Generated by Django 5.1.4 on 2025-01-12 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userlogin',
            name='name',
        ),
        migrations.AddField(
            model_name='userlogin',
            name='date_joined',
            field=models.DateTimeField(default='2025-01-13 00:00:00'),
        ),
        migrations.AddField(
            model_name='userlogin',
            name='username',
            field=models.CharField(default='Anonymous', max_length=150),
            preserve_default=False,
        ),
    ]
