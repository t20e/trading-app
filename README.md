### A django portfolio project that lets users demo trade forcast perdictions on which way the price will go in a few mins of popular currency pairs, with a starting net worth of $15,000, this app is to show my knowledge of django



TODO:
    user reg account
        allow user photos if they decline then
            :add a photo for user
        : log out
    user login
    user trade
        : buy and sell
        : user can see a history of all trades and  open trades




mysql schema:
    user:
        id:
        first_name:
        last_name:
        all_trades: []
        age:
        email:
        password:
        pfp_id:
        balance:

    trade:
        id:
        user_id:
        currency_pair:
        price:
        prediction:
        expires_at: 2 mins
        timeStamp:
        profit:

