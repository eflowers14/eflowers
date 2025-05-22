num1 = float(input("Dime el 1er numero: "))
operador = input("Que vas a hacer?: ")
num2 = float(input("Dime el 2do numero: "))

if operador == "+":
    print("La suma es igual a: ", int(num1 + num2))
elif operador == "-":
    print("La resta es igual a: ", int(num1 - num2))
elif operador == "*":
    print("La multiplicacion es igual a: ", int(num1 * num2))
elif operador == "/":
    print("La division es igual a: ", num1 / num2)
else:
    print("Escriba bien el operador\n")
