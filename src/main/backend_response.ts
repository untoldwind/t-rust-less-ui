import { CommandResult } from "../common/command_results";
import { ServiceEvent } from "../common/service_event";

export interface CommandResponse {
  command: {
    id: number
    result: CommandResult
  }
}

export interface EventResponse {
  event: ServiceEvent
}

export type BackendResponse = CommandResponse | EventResponse;

export function isCommandResponse(response: BackendResponse): response is CommandResponse {
  return typeof response === "object" && typeof (response as CommandResponse).command !== "undefined";
}

export function isEventResponse(response: BackendResponse): response is EventResponse {
  return typeof response === "object" && typeof (response as EventResponse).event !== "undefined";
}