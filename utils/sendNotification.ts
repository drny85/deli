import axios from 'axios';

export const sendNotification = async (
    pushToken: string,
    title: string,
    body: string,
    data: { notificationType: string; result: any }
) => {
    try {
        if (!pushToken) return;
        const { data: res } = await axios.post(
            'https://exp.host/--/api/v2/push/send',
            JSON.stringify({
                to: pushToken,
                title: title,
                body: body,
                data: data
            }),
            {
                headers: {
                    host: 'exp.host',
                    accept: 'application/json',
                    'accept-encoding': 'gzip, deflate',
                    'content-type': 'application/json'
                }
            }
        );

        console.log(data, res);
    } catch (error) {
        console.log(error);
    }
};
