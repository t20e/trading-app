from django.conf import settings
import boto3
from botocore.config import Config
import datetime
import environ
import boto3

env = environ.Env()
environ.Env.read_env()


class S3:

    def __init__(self):
        self.client = boto3.client(
            's3',
            env('AWS_REGION'),
            # endpoint_url=env('AWS_S3_ENDPOINT_URL'),
            aws_access_key_id=env('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=env('AWS_SECRET_ACCESS_KEY'),
            config=Config(signature_version='s3v4'))

    def get_presigned_url(self, key, time=3600):
        return self.client.generate_presigned_url(
            ClientMethod='put_object',
            ExpiresIn=time,
            Params={
                'Bucket': env('AWS_STORAGE_BUCKET_NAME'),
                'Key': key
            })

    def get_file(self, key, time=3600):
        return self.client.generate_presigned_url(
            ClientMethod='get_object',
            ExpiresIn=time,
            Params={
                'Bucket': env('AWS_STORAGE_BUCKET_NAME'),
                'Key': key
            })

    def delete_file(self, key):
        return self.client.delete_object(Bucket=env('AWS_STORAGE_BUCKET_NAME'),
                                         Key=key)
