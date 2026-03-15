from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Extra", {"fields": ("name", "phone_number", "profile_picture")}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Extra", {"fields": ("name", "phone_number", "profile_picture")}),
    )
    list_display = ("id", "email", "name", "phone_number", "is_staff")
    ordering = ("email",)