ALTER TABLE "AiConversation"
ADD COLUMN "customerId" UUID;

CREATE INDEX "AiConversation_customerId_idx"
ON "AiConversation"("customerId");

ALTER TABLE "AiConversation"
ADD CONSTRAINT "AiConversation_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
