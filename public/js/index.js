$('#orderForm').on('submit', 
    function ()
        {
            let name = $("#inp1").val();

            let date = new Date($("#inp2").val());

            let year = date.getFullYear();

            let amount = $("#inp3").val();

            let email = $("#inp4").val();

            let price = 0;

            price = amount * 500;

            if (year < (2023-18)){

                price = price * 2;
            
            }

            alert(`Стоимость услуги для ${name} составит ${price} рублей\n` + 
            `(Для совершеннолетних двойной тариф)` +
            `\nБолее подробная информация отправлена на почту ${email}`
            )
        }
)