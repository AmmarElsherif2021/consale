

# Tauri + React + SQLite
This is an initial release of <strong>consale</strong> a desktop software app for handling billing system.<br/>
To get the installer open bundle directory and choose msi or nsis. <br/>
<strong>username </strong>: admin <br/>
<strong>password</strong>: 123

## Features:

<strong>Setting accounts data for workers.</strong><br/> 
<strong>Managing store by:</strong><br/> 
    1- adding customized items<br/> 
    2- editing store items data (stock quantity and unit price) <br/> 
    3- deleting items.<br/> 
<strong>Adding a new bill:</strong> <br/> 
    1-setting its name and phone number <br/> 
    2-adding new items to the bill <br/> 
    3-removing old added items to bill with regarding its pre-setted price. <br/> 
    4-adding payment charges and maintaining debt remained after each payment order <br/> 
    5-reviewing the history of bill operations.<br/> 
    6-searching for a particular bill by its name.<br/> 
    7-arranging bills due to debt.<br/> 
    8-deleting a particular bill record.<br/> 
    9-printing bill items table and/or operations history.<br/> 

# Screens:
## Login page:
 you can also alter language context from top-left toggle
![S](/screenshots/s-3.jpeg "Screen")
## Stock management section:
User can add, modify and delete items to/from the stock all items are defined by their IID, names, price/unit and their unit type (i.e weights in kg or gm length in m or mm ,,etc)
![S](/screenshots/s1.jpeg "Screen")

![S](/screenshots/s2.jpeg "Screen")

![S](/screenshots/s3.jpeg "Screen")

![S](/screenshots/s5.jpeg "Screen")

![S](/screenshots/s4.jpeg "Screen")

User can edit added items by adding or substracting from the quantity of the stock but user can not change the entire quantity of the stock for unintended possible accounting mistakes, Also, the import price and export price are editable.
![S](/screenshots/s6.jpeg "Screen")

## Add Bill section
This section is divided by two main columns the left hand is the new bill space each bill is distinguished by its BID (written in red) and customer name and (not required) his/her phone.
The right side is an old bills archive.
![S](/screenshots/s7.jpeg "Screen")

After clicking on proceed button payments check stage with possibility for both buyer and customer to schedule payments in the bill record as shown below in this screen there is no history of operations recorded yet .
![S](/screenshots/s8.jpeg "Screen")

Confirm saving bill
![S](/screenshots/s9.jpeg "Screen")

Bill is saved! look right the screen, because there is +ve debt on the bill, the bill card colored red.
![S](/screenshots/s10.jpeg "Screen")

If user saved the bill with 0 debt recorded then the bill card is colored yellow.
![S](/screenshots/s11.jpeg "Screen")
![S](/screenshots/s12.jpeg "Screen")

User can edit any recorded bill as long as it is recorded, by clicking bill card user can read a summary of the bill data, by clicking edit button the bill is reopened with ability to add extra items and/or edit payments quantities based on latest activity.
![S](/screenshots/s13.jpeg "Screen")

Previously added items are marked to be distinguished from the newly added items with their prices newly updated.
For exaple suppose we have saved "addedStuff4" sold fot in price of "22$/unit" for "name of someone" name of customer
![S](/screenshots/s14.jpeg "Screen")

Now we can update the "newAddedStuff4"
![S](/screenshots/s15.jpeg "Screen")
![S](/screenshots/s16.jpeg "Screen")

Back to the bill, now user can try return the item back and withdraw his money back, the withrawn payment i calculated based on old price recorded in its archive of ops. the stock of the item is increased by the restored quantity.
![S](/screenshots/s17.jpeg "Screen")

![S](/screenshots/s18.jpeg "Screen")

![S](/screenshots/s19.jpeg "Screen")

If user checked in a bill in _ve amount of the bill debt, the bill card is colored green.
![S](/screenshots/s20.jpeg "Screen")
![S](/screenshots/s21.jpeg "Screen")

## Accounting section
![S](/screenshots/s22.jpeg "Screen")
![S](/screenshots/s23.jpeg "Screen")


