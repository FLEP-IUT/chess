#Auteurices: DUCHATEAU Enzo, CONSTANS Florence
#Dernière modification: 18/11/21

#imports--------------
import sys
sys.path.append(".")
from Board import *
#---------------------

listColumns = ['a','b','c','d','e','f','g','h']
listRows = ['1', '2', '3', '4', '5', '6', '7', '8']

class Piece:
    #Attributs
    idPiece = 0
    colour = 0
    position = ['a', '1']
    #Contructeurs
    def __init__(self, id, colour, position):
         self.idPiece = id
         self.colour = colour
         self.position = position
    #Méthodes

    def canReplace(self, piece):
        if self.colour!=piece.colour:
            return(True)
        else:
            return(False)

    def move(self):
        pass

class Queen(Piece):
    #Méthodes
    def move(self):
        pass

class King(Piece):
    #Méthodes
    def move(self):
        pass

class Pawn(Piece):
    #Méthodes
    def move(self):
        pass

class Rook(Piece):
    #Méthodes
    def move(self):
        pass

class Knight(Piece):
    #Méthodes
    def move(self):
        pass

class Bishop(Piece):
    #Méthodes
    def move(self):
        pass