import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCrudService } from "./createCrudService";
import { apiClient } from "./client";

vi.mock("./client", () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPut = vi.mocked(apiClient.put);
const mockDelete = vi.mocked(apiClient.delete);

describe("createCrudService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("path normalization", () => {
        it("appends trailing slash to resource path", async () => {
            const service = createCrudService("athletes");
            mockGet.mockResolvedValue({ data: [] });
            await service.list();
            expect(mockGet).toHaveBeenCalledWith("athletes/");
        });

        it("normalizes path with leading slash", async () => {
            const service = createCrudService("/athletes/");
            mockGet.mockResolvedValue({ data: [] });
            await service.list();
            expect(mockGet).toHaveBeenCalledWith("athletes/");
        });

        it("normalizes path with extra slashes", async () => {
            const service = createCrudService("//athletes//");
            mockGet.mockResolvedValue({ data: [] });
            await service.list();
            expect(mockGet).toHaveBeenCalledWith("athletes/");
        });
    });

    describe("list", () => {
        it("returns array directly when response is an array", async () => {
            const data = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
            mockGet.mockResolvedValue({ data });

            const service = createCrudService("athletes");
            const result = await service.list();

            expect(result).toEqual(data);
        });

        it("extracts results from paginated response", async () => {
            const items = [{ id: 1 }, { id: 2 }];
            const data = { count: 2, next: null, previous: null, results: items };
            mockGet.mockResolvedValue({ data });

            const service = createCrudService("athletes");
            const result = await service.list();

            expect(result).toEqual(items);
        });

        it("returns empty array for null response", async () => {
            mockGet.mockResolvedValue({ data: null });

            const service = createCrudService("athletes");
            const result = await service.list();

            expect(result).toEqual([]);
        });

        it("returns empty array for object without results", async () => {
            mockGet.mockResolvedValue({ data: { count: 0 } });

            const service = createCrudService("athletes");
            const result = await service.list();

            expect(result).toEqual([]);
        });

        it("returns empty array for string response", async () => {
            mockGet.mockResolvedValue({ data: "unexpected" });

            const service = createCrudService("athletes");
            const result = await service.list();

            expect(result).toEqual([]);
        });
    });

    describe("getById", () => {
        it("fetches a single resource by id", async () => {
            const athlete = { id: 42, first_name: "Alice" };
            mockGet.mockResolvedValue({ data: athlete });

            const service = createCrudService("athletes");
            const result = await service.getById(42);

            expect(mockGet).toHaveBeenCalledWith("athletes/42/");
            expect(result).toEqual(athlete);
        });

        it("accepts string id", async () => {
            mockGet.mockResolvedValue({ data: { id: "7" } });

            const service = createCrudService("athletes");
            await service.getById("7");

            expect(mockGet).toHaveBeenCalledWith("athletes/7/");
        });
    });

    describe("create", () => {
        it("posts payload to resource path", async () => {
            const payload = { first_name: "Alice", last_name: "Smith" };
            const created = { id: 1, ...payload };
            mockPost.mockResolvedValue({ data: created });

            const service = createCrudService("athletes");
            const result = await service.create(payload);

            expect(mockPost).toHaveBeenCalledWith("athletes/", payload);
            expect(result).toEqual(created);
        });
    });

    describe("update", () => {
        it("puts payload to resource path with id", async () => {
            const payload = { first_name: "Updated" };
            const updated = { id: 1, ...payload };
            mockPut.mockResolvedValue({ data: updated });

            const service = createCrudService("athletes");
            const result = await service.update(1, payload);

            expect(mockPut).toHaveBeenCalledWith("athletes/1/", payload);
            expect(result).toEqual(updated);
        });
    });

    describe("remove", () => {
        it("sends delete request to resource path with id", async () => {
            mockDelete.mockResolvedValue({ data: null });

            const service = createCrudService("athletes");
            await service.remove(5);

            expect(mockDelete).toHaveBeenCalledWith("athletes/5/");
        });
    });
});
