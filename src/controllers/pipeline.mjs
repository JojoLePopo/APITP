import axios from 'axios';

const Pipeline = class Pipeline {
    constructor(app) {
        this.app = app;
        this.run();
    }

async getData() {
    this.app.get('/pipeline', async (req, res) => {
        try {
            const usersRandom = await axios.get('https://randomuser.me/api', {
                headers: {
                    'X-Api-Key': '9972b6e41a37489890db8a6f25933ee3'
                }
            });

            const phoneNumberRandom = await axios.get('https://randommer.io/Phone/Generate?CountryCode=FR&Quantity=1', {
                headers: {
                    'X-Api-Key': '9972b6e41a37489890db8a6f25933ee3'
                }
            });

            const ibanRandom = await axios.get('https://randommer.io/api/Finance/Iban/FR', {
                headers: {
                    'X-Api-Key': '9972b6e41a37489890db8a6f25933ee3'
                }
            });

            const creditCardRandom = await axios.get('https://randommer.io/api/Card?type=mastercard', {
                headers: {
                    'X-Api-Key': '9972b6e41a37489890db8a6f25933ee3'
                }
            });

            const nameRandom = await axios.get('https://randommer.io/api/Name?nameType=fullname&quantity=1', {
                headers: {
                    'X-Api-Key': '9972b6e41a37489890db8a6f25933ee3'
                }
            });

            res.status(200).json({
                usersRandom: usersRandom.data,
                phoneNumberRandom: phoneNumberRandom.data,
                ibanRandom: ibanRandom.data,
                creditCardRandom: creditCardRandom.data,
                nameRandom: nameRandom.data
            });
        } catch (error) {
            console.error('Error fetching data:', error);

            res.status(400).json({
                code: 400,
                message: 'Error fetching data',
            });
        }
    });
}
}