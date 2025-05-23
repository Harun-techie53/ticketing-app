import { OrderExpiredEvent, Publisher, Subjects } from "@hrrtickets/common";

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent>{
    subject: Subjects = Subjects.OrderExpired;

    onPublish(): void {
        console.log('Publishing Order Expired Event');
    }
}