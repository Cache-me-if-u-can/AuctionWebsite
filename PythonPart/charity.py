import hashlib

class Charity(object):
    def __init__(self, _id, name, email, phoneNum, password, imageFile, address, hash_password=True):
        self.__id = _id  
        self.__name = name
        self.__email = email
        self.__phoneNum = phoneNum
        self.__imageFile= imageFile
        self.__address= address
        if hash_password:
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
    def imageFile(self):
        return self.__imageFile

    @imageFile.setter
    def imageFile(self, imageFile):
        self.__imageFile = imageFile

    @property
    def address(self):
        return self.__address

    @address.setter
    def address(self, address):
        self.__address = address

    @property
    def password(self):
        return self.__password

    @password.setter
    def password(self, password):
        self.__password = self._passwordHashing(password)

    def change_password(self, new_password):                  # make private?
        self.__password = self._passwordHashing(new_password)