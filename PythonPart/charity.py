import hashlib
import base64


class Charity(object):

    def __init__(
        self,
        name,
        email,
        phoneNum,
        password,
        image,
        address,
        description="Default description placeholder that charity will change in the profile later on",
        website="",
        _id=0,
        hashed_password=False,
    ):
        self.__id = _id
        self.__name = name
        self.__email = email
        self.__phoneNum = phoneNum
        self.__image = image
        self.__address = address
        self.__description = description
        self.__website = website
        if not hashed_password:
            self.__password = self._passwordHashing(password)
        else:
            self.__password = password

    def _passwordHashing(self, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        return hashed_password

    @property
    def id(self):
        return self.__id

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name):
        self.__name = name

    @property
    def email(self):
        return self.__email

    @email.setter
    def email(self, email):
        self.__email = email

    @property
    def phoneNum(self):
        return self.__phoneNum

    @phoneNum.setter
    def phoneNum(self, phoneNum):
        self.__phoneNum = phoneNum

    @property
    def image(self):
        return self.__image

    @image.setter
    def image(self, image):
        self.__image = image

    @property
    def address(self):
        return self.__address

    @address.setter
    def address(self, address):
        self.__address = address

    @property
    def description(self):
        return self.__description

    @description.setter
    def description(self, description):
        self.__description = description

    @property
    def website(self):
        return self.__website

    @website.setter
    def website(self, website):
        self.__website = website

    @property
    def password(self):
        return self.__password

    @password.setter
    def password(self, password):
        self.__password = self._passwordHashing(password)

    def change_password(self, new_password):  # make private?
        self.__password = self._passwordHashing(new_password)
