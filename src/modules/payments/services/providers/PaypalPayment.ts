import paypal from "@paypal/paypal-server-sdk";
import { IPaymentProvider } from "./IPaymentProvider";
import { PaymentRequest } from "../PaymentService";

export class PaypalPayment implements IPaymentProvider {
    private paypalClient: paypal.core.PayPalHttpClient;

    constructor(clientId: string, clientSecret: string, isSandbox: boolean = true) {
        const environment = isSandbox
            ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
            : new paypal.core.LiveEnvironment(clientId, clientSecret);

        this.paypalClient = new paypal.core.PayPalHttpClient(environment);
    }

    async processPayment(req: PaymentRequest): Promise<{ status: "success" | "failure"; transactionId: string }> {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: req.currency,
                            value: req.amount.toFixed(2),
                        },
                        description: req.packageTitle,
                    },
                ],
            });

            const order = await this.paypalClient.execute(request);

            return {
                status: "success",
                transactionId: order.result.id,
            };
        } catch (error: any) {
            console.error("PayPal payment error:", error);
            // Generate a temporary transactionId (or empty string) for failed payments
            return {
                status: "failure",
                transactionId: "", // required by interface
            };
        }
    }

}
