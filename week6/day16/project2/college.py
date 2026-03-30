# avg =0
# sum=0
# i=0
# marks=[]

# for i in range(3):
  
#   marks[i] = int(input("Enter marks: "))
#   sum=sum+marks
#   if marks[i]>=90:
#     print('A')
#   elif marks[i]>80:
#     print('B')
#   elif marks>70:
#     print('C')

# marks.add(89)
# avg=sum/3
# print('Avg Marks: ',avg)

def calculateTotal(prices):
  print(prices)
  print('Total is ',sum(prices))

items=[]
for i in range(2):
  price=float(input(f'Enter item {i+1} price: '))
  items.push(price)

calculateTotal(items)


