#Auteurices: DUCHATEAU Enzo, CONSTANS Florence
#Dernière modification: 18/11/21

#imports--------------
import sys
sys.path.append(".")
from Pieces import *
#---------------------

class Board:
    #Attributs
    onBoardPieces = []
    offBoardPieces = []
    
    #Constructeurs
    def __init__(self):
         pass
     
    #Méthodes
    def verifyPosition(self, position):
        found=False
        i=0
        while not found and i < len(self.onBoardPieces):
            if self.onBoardPieces[i].position==position:
                found=True
                return(self.onBoardPieces[i])
            else:
                i+=1
        return(None)

    def addPiece(self, piece):
        self.onBoardPieces.append(piece)
    def removePiece(self, piece):#Retire la pièce du plateau pour la mettre dans la liste des pièces retirées
        self.onBoardPieces.remove(piece)
        self.offBoardPieces.append(piece)
    def banishPiece(self, piece):#Retire entièrement la pièce du jeu (utile quand un pion se transforme)
        self.onBoardPieces.remove(piece)